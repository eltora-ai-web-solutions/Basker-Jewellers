// POST /api/save  - used by admin.html when the site runs on Vercel.
// Vercel's disk is read-only, so we commit the changed files to GitHub instead.
// The push makes Vercel redeploy automatically (about 30-60 seconds).
//
// Environment variables (Vercel -> Project -> Settings -> Environment Variables):
//   GITHUB_TOKEN      fine-grained token, repo access, "Contents: Read and write"
//   GITHUB_REPO       owner/repo   e.g.  mybaskar/basker-jewellers-site
//   ADMIN_SAVE_KEY    any long secret you choose (admin asks for it once)
//   GITHUB_BRANCH     optional, default "main"
//   GITHUB_BASE_PATH  optional, folder inside the repo that holds index.html (default: repo root)
const crypto = require('crypto');

const OK_IMG = /\.(jpe?g|png|webp|gif|svg)$/i;

function safePath(p) {
  if (typeof p !== 'string') return null;
  p = p.replace(/\\/g, '/').replace(/^\/+/, '');
  if (p === 'site-data.js') return p;
  const parts = p.split('/');
  if (parts[0] === 'images' && parts.length > 1 && !parts.includes('..') && !parts.includes('.') && OK_IMG.test(p)) return p;
  return null;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).send('POST only');

  const { GITHUB_TOKEN, GITHUB_REPO, ADMIN_SAVE_KEY } = process.env;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const base = (process.env.GITHUB_BASE_PATH || '').replace(/^\/+|\/+$/g, '');
  if (!GITHUB_TOKEN || !GITHUB_REPO || !ADMIN_SAVE_KEY)
    return res.status(500).send('Server not configured: set GITHUB_TOKEN, GITHUB_REPO and ADMIN_SAVE_KEY in Vercel.');

  const given = Buffer.from(String(req.headers['x-admin-key'] || ''));
  const want = Buffer.from(ADMIN_SAVE_KEY);
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want))
    return res.status(401).send('Wrong admin key');

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return res.status(400).send('Bad JSON'); } }
  const files = body && Array.isArray(body.files) ? body.files : null;
  if (!files || !files.length) return res.status(400).send('No files');
  const message = String((body && body.message) || 'Admin: update website').slice(0, 200);

  const tree = [];
  for (const f of files) {
    const p = safePath(f && f.path);
    if (!p || typeof f.content !== 'string') return res.status(400).send('Path not allowed: ' + (f && f.path));
    tree.push({ path: base ? base + '/' + p : p, content: f.content });
  }

  const api = async (path, method, data) => {
    const r = await fetch('https://api.github.com/repos/' + GITHUB_REPO + path, {
      method,
      headers: {
        Authorization: 'Bearer ' + GITHUB_TOKEN,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'baskar-admin',
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    const t = await r.text();
    if (!r.ok) throw new Error('GitHub ' + r.status + ' on ' + method + ' ' + path + ': ' + t.slice(0, 200));
    return t ? JSON.parse(t) : {};
  };

  try {
    const ref = await api('/git/ref/heads/' + branch, 'GET');
    const headSha = ref.object.sha;
    const head = await api('/git/commits/' + headSha, 'GET');
    const entries = [];
    for (const t of tree) {
      const blob = await api('/git/blobs', 'POST', { content: t.content, encoding: 'base64' });
      entries.push({ path: t.path, mode: '100644', type: 'blob', sha: blob.sha });
    }
    const newTree = await api('/git/trees', 'POST', { base_tree: head.tree.sha, tree: entries });
    const commit = await api('/git/commits', 'POST', { message, tree: newTree.sha, parents: [headSha] });
    await api('/git/refs/heads/' + branch, 'PATCH', { sha: commit.sha });
    return res.status(200).send('saved');
  } catch (e) {
    return res.status(500).send(String(e.message || e));
  }
};

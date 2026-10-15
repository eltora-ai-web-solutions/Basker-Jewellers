// GET /api/ping  ->  "ok" when cloud saving is configured, otherwise "notconfigured"
module.exports = (req, res) => {
  const { GITHUB_TOKEN, GITHUB_REPO, ADMIN_SAVE_KEY } = process.env;
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(GITHUB_TOKEN && GITHUB_REPO && ADMIN_SAVE_KEY ? 'ok' : 'notconfigured');
};

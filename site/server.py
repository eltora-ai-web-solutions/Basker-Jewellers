# Baskar Jewellers - local server. Run:  python server.py
# Serves the website and lets admin.html save changes straight into this folder.
import os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 5500
os.chdir(ROOT)

class H(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *a):
        pass

    def _reply(self, code, text):
        b = text.encode()
        self.send_response(code)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if urlparse(self.path).path == '/__ping':
            return self._reply(200, 'ok')
        super().do_GET()

    def do_POST(self):
        u = urlparse(self.path)
        if u.path != '/__save':
            return self._reply(404, 'not found')
        rel = unquote(parse_qs(u.query).get('path', [''])[0]).replace('\\', '/').lstrip('/')
        allowed = rel == 'site-data.js' or (rel.startswith('images/') and '..' not in rel.split('/'))
        if not allowed:
            return self._reply(400, 'path not allowed')
        dest = os.path.abspath(os.path.join(ROOT, rel))
        if not dest.startswith(ROOT + os.sep):
            return self._reply(400, 'path not allowed')
        n = int(self.headers.get('Content-Length', 0))
        data = self.rfile.read(n)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, 'wb') as f:
            f.write(data)
        self._reply(200, 'saved')

if __name__ == '__main__':
    try:
        srv = ThreadingHTTPServer(('127.0.0.1', PORT), H)
    except OSError:
        print('Port %d is already in use. Close the other server window and try again.' % PORT)
        sys.exit(1)
    print('Baskar Jewellers is running.')
    print('  Website : http://localhost:%d/index.html' % PORT)
    print('  Admin   : http://localhost:%d/admin.html' % PORT)
    print('Keep this window open. Press Ctrl+C to stop.')
    srv.serve_forever()

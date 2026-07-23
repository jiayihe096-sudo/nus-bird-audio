# NUS Bird Finder - Local Audio Server
# Run: python server.py
# Then open http://localhost:8000 in browser
import http.server
import socketserver
import os

PORT = 8000
DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

print(f"Serving NUS Bird Finder audio on http://localhost:{PORT}")
print(f"Files available:")
for f in sorted(os.listdir(DIR)):
    if f.endswith('.mp3') or f.endswith('.wav'):
        size = os.path.getsize(os.path.join(DIR, f))
        print(f"  http://localhost:{PORT}/{f}  ({size//1024} KB)")
print("\nPress Ctrl+C to stop")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()

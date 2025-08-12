import http.server
import socketserver
import os

PORT = 1314
web_dir = os.path.join(os.path.dirname(__file__))
os.chdir(web_dir)

Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"服务器已启动，正在监听端口 {PORT}")
print(f"请在浏览器中打开 http://localhost:{PORT}")

httpd.serve_forever()
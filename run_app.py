import webview
import http.server
import socketserver
import threading
import os

PORT = 1314

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(__file__), **kwargs)

def start_server():
    """Starts a simple HTTP server in a separate thread."""
    handler = MyHttpRequestHandler
    httpd = socketserver.TCPServer(("localhost", PORT), handler)
    httpd.serve_forever()

if __name__ == '__main__':
    # Start the server in a background thread
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()

    # Create and start the webview
    webview.create_window(
        'RedNote 排版工具',
        f'http://localhost:{PORT}',
        width=1280,
        height=800,
        resizable=True,
        min_size=(800, 600)
    )
    webview.start()

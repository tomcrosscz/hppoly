import http.server
import ssl

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

httpd = http.server.HTTPServer(('0.0.0.0', 443), CORSRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               keyfile='cert/selfsigned.key',
                               certfile='cert/selfsigned.crt',
                               server_side=True)
print("Serving on https://0.0.0.0:443")
httpd.serve_forever()

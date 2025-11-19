import http.server
import ssl

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
       # Moderní SSL kontext        super().end_headers()
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile='cert/selfsigned.crt', keyfile='cert/selfsigned.key')

httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print("Serving on https://0.0.0.0:443")
httpd.serve_forever()

# Spuštění HTTP serveru
httpd = http.server.HTTPServer(('0.0.0.0', 443), CORSRequestHandler)

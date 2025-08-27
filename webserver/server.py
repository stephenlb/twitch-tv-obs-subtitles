#!/usr/bin/python
# server
#    python server.py
# browser
#    https://localhost:4443

import http.server
import ssl
port = 4443
host = 'localhost'
server_address = ('0.0.0.0', port)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(
    httpd.socket,
    server_side=True,
    certfile='/root/webserver/localhost.crt',
    keyfile='/root/webserver/localhost.key')
print(f"Server running on https://{host}:{port}")
try: httpd.serve_forever()
except: 0

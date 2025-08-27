#!/bin/zsh
#openssl req -x509 -out /root/webserver/localhost.crt -keyout /root/webserver/localhost.key -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -extensions EXT -config <(printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
cd /root/website
python /root/webserver/server.py

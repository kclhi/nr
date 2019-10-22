#!/usr/bin/env bash
set -eu
org=nr-ca

openssl genpkey -algorithm RSA -out nr.key
openssl req -x509 -key nr.key -days 365 -out nr.crt \
    -subj "/CN=$org/O=$org"

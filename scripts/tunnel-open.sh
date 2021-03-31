#!/usr/bin/env bash

NODE_ENV=$(grep NODE_ENV .env | cut -d '=' -f 2-)
TUNNEL_PORT=$(grep TUNNEL_PORT .env | cut -d '=' -f 2-)
TUNNEL_URI=$(grep TUNNEL_URI .env | cut -d '=' -f 2-)

# Opens the ssh tunnel
ssh -f -M -N -S /tmp/session1 -L $TUNNEL_PORT:$TUNNEL_URI:5432 bfl-$NODE_ENV -v

echo "Successfully connected."

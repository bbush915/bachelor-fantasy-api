#!/usr/bin/env bash

NODE_ENV=$(grep NODE_ENV .env | cut -d '=' -f 2-)

# Closes the ssh tunnel
ssh -S /tmp/session1 -O exit bfl-$NODE_ENV

#!/usr/bin/env bash

docker build -t grokery:app .
 
docker run -d -p 80:80 grokery:app

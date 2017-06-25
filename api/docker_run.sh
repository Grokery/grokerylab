#!/usr/bin/env bash

# docker run -d -p 27017:27017 mongo

docker build -t grokery:api .

docker run -d -p 5000:5000 grokery:api

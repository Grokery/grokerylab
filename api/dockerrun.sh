#!/usr/bin/env bash

./dockerbuild.sh

docker run --env-file ./environments/dev.env.config -d -p 8000:8000 grokerylab

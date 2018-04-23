#!/usr/bin/env bash

docker run --env-file ./environments/dev.env.config -d -p 8000:8000 grokery/grokerylab

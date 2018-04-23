#!/usr/bin/env bash

virtualenv -p /Library/Frameworks/Python.framework/Versions/2.7/bin/python2.7 .venv

source .venv/bin/activate

pip install -r requirements.txt

python server.py

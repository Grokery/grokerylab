#!/usr/bin/env bash

# This is a quick and smelly dev script used to sync the admin, common, and core modules 
# from the spring api project (where i generally develop local debug) to the serverless api 
# project so I can deploy it seprately.

cp -r api-spring/src/main/java/io/grokery/lab/api/admin api-serverless/src/main/java/io/grokery/lab/api/
cp -r api-spring/src/main/java/io/grokery/lab/api/common api-serverless/src/main/java/io/grokery/lab/api/
cp -r api-spring/src/main/java/io/grokery/lab/api/core api-serverless/src/main/java/io/grokery/lab/api/

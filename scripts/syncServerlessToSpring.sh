#!/usr/bin/env bash

# This is a quick and smelly dev script used to sync the admin, common, and cloud modules
# from the spring api project (where i generally develop local debug) to the serverless api
# project so I can deploy it seprately.

rm -r api-spring/src/main/java/io/grokery/lab/api/admin
rm -r api-spring/src/main/java/io/grokery/lab/api/common
rm -r api-spring/src/main/java/io/grokery/lab/api/cloud

cp -r api-serverless/src/main/java/io/grokery/lab/api/admin api-spring/src/main/java/io/grokery/lab/api/
cp -r api-serverless/src/main/java/io/grokery/lab/api/common api-spring/src/main/java/io/grokery/lab/api/
cp -r api-serverless/src/main/java/io/grokery/lab/api/cloud api-spring/src/main/java/io/grokery/lab/api/

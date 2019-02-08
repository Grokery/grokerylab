# GrokeryLab Api Serverless

GrokeryLab RESTful API

## Build and Deploy

After building and installing api-core lib, copy environments/example-env.yml to environments/env.yml and set host aws access and secret key and any other env vars as needed. Then:

Run ```mvn clean package``` to package

Run ```./deploy.sh <sls-stage-name>``` to build and deploy as serverless framework. "sls-stage-name" would be 'dev', 'prod' etc.

## Notes 


# GrokeryLab Api Serverless

GrokeryLab RESTful API

## Build and Deploy

Copy environments/example-env.yml to environments/env.yml and set host aws access and secret key and any other env vars as needed

Run ```mvn clean package``` to package

Run ```./deploy.sh <sls-stage-name>``` to build and deploy as serverless framework. "sls-stage-name" would be 'dev', 'prod' etc.

## Notes 

The /core, /common, and /admin code folders in src are identicial to those in the api-spring project. I've been copy replaceing them to the other project whenever I modify them. I had them in another library project but debuging was a pain and yeah. There's probably a better way but havn't got around to it.
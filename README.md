# GrokeryLab

    Grok v: To understand deeply and intuitively

GrokeryLab is a business intelligence pipeline management platform.


## Usage

The GrokeyLab rest api can be run as a Java Spring app in a Docker container, or serverlessly in AWS using ApiGateway and Lambda functions. 
You can find instructions for running the api in the respective modes in the /api-spring and /api-serverless folders README files.

The GrokeyLab ui is a Javascript/React project and can be run either in an nginx Docker container or serverlessly in AWS S3. 

Once you've got the api and app running, you can initialize the required superadmin user with the initSuperuser.sh script found in the /scripts folder.

Finaly, use the superadmin account credentials you created in the last step and the createAccount.sh script to create a normal account and admin user that you can use to login via the app ui. 


## Contributng

If you are interested in contributing please reach out to me here https://grokery.io/#contact


## License

GrokeryLab - A data pipeline management platform

    **Author:**  Dan Hogue (<chmod740@gmail.com>)
    **Copyright:**  Copyright 2018, Grokery
    **License:**  Apache License, Version 2.0

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

# GrokeryLab


## Build & Deploy

You will need Git, Npm, Python and Docker.

Clone repo:

    git clone https://github.com/Grokery/grokerylab.git
    cd grokerylab
    cp api/common/.env-example api/common/.env

Edit .env variables, then:

    cd app
    npm install
    npm run build
    cd ../

Finally, to start:

    docker-compose up

Or, to locally in dev mode:

    cd api
    ./run_with_venv.sh (or run_with_venv.bat)

...and in a new window:

    cd app
    npm start

## License

GrokeryLab - A dataflow management platform

|                      |                                          |
|:---------------------|:-----------------------------------------|
| **Author:**          | Dan Hogue (<chmod740@gmail.com>)
| **Copyright:**       | Copyright 2016, Grokery
| **License:**         | Apache License, Version 2.0

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

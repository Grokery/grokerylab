# GrokeryLab

    Grok v: To understand deeply and intuitively or by empathy
    Grokery n: A place of deep insight

GrokeryLab is an end-to-end data pipeline management & data exploration platform.

## Raison d'etre

Provide a top level, integrated and transparent platform that makes it easy to:

1. Create and manage big (or small) data pipelines to ingest and process intelligence data
3. Collaborate with others through all three phases of the intelligence stack: Ingestion, Processization, and Visualization. 


## Getting up and running

Clone repo and set up env vars:

    git clone https://github.com/Grokery/grokerylab.git
    cd grokerylab
    cp api/common/.env-example api/common/.env

Edit env vars as necessary, then run API with:

    ./api/run_with_venv.sh (or run_with_venv.bat)

Then in a new window:

    cd app
    npm install
    npm start

## Using and contributing

GrokeryLab is licensed under the Apache license because I believe in the power of openness, transparency, and community.

I am currently building out my core open source developer team. 
If you are interested please reach out via the form on the website: [https://grokery.io/#contact](https://grokery.io/#contact)

## License

GrokeryLab - A dataflow management platform

    **Author:**  Dan Hogue (<chmod740@gmail.com>)
    **Copyright:**  Copyright 2017, Grokery
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


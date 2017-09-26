# GrokeryLab

    Grok v: To understand deeply and intuitively or by empathy
    Grokery n: A place of deep insight

GrokeryLab is an end-to-end data flow management & exploration platform.

I'm creating it because I want a top level, integrated and transparent platform that makes it easy to:

1. Create and manage big (or small) data pipelines to ingest and process intelligence data
2. Create beautiful and informative visualizations that are completely integrated into the pipelines
3. Collaborate with others through all three phases of the intelligence stack: Ingestion, Processization, and Visualization. 

## Raison d'etre

The central pain point that this product takes to heart is the difficulty of understanding and managing the pedigree of the data flowing through our intelligence systems.

Data pedigree is about knowing three things:

1. Where the data came from
2. What's been done to it, and
3. Who else uses/knows about it

Knowing these basic facts is essential to knowing weather the data is trustworthy, which is of course vital to making good business decisions.

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

GrokeryLab is licensed under the Apache license because I believe in the power of openness, 
transparency, and community.

If you are interested in using this product, feel free! If you would like to contribute, please do! 

You can contact me using the form on the website: [https://grokery.io/#contact](https://grokery.io/#contact)

## License

GrokeryLab - A dataflow management platform

    **Author:**  Dan Hogue (<chmod740@gmail.com>)
    **Copyright:**  Copyright 2016, Grokery
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


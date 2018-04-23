#!/usr/bin/env bash

# build core libs
cd ../grokerylab-api-core
mvn clean install

# build spring 
cd ../grokerylab-api-spring
mvn clean package

# run spring
export $(cat ./environments/dev.env.config | grep -v ^# | xargs)
java -jar target/grokerylab-api-spring-0.1.0.jar

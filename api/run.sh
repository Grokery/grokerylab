#!/usr/bin/env bash

mvn clean package

# run spring
export $(cat ./environments/prod.env.config | grep -v ^# | xargs)
java -jar target/grokerylab-api-spring-0.1.0.jar

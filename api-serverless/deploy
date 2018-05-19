#!/usr/bin/env bash

echo "Clean and Package:"
mvn clean package

echo "Deploy to $1"
sls deploy -s $1

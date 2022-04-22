#!/bin/bash

rm -rf ./layer
mkdir layer

docker build -t clamav -f Dockerfile .
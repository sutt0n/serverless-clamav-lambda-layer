#!/bin/bash

rm -rf ./layer
mkdir layer

docker build -t clamav -f Dockerfile .
docker run --name clamav clamav
docker cp clamav:/home/build/clamav_lambda_layer.zip .
docker rm clamav
mv clamav_lambda_layer.zip ./layer

pushd layer
unzip -n clamav_lambda_layer.zip
rm clamav_lambda_layer.zip
popd
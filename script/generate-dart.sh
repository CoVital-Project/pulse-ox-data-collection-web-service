#!/bin/sh
set -ex

SCHEMA=reference/pulseox-data-collector.v1.json

docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
    -i /local/${SCHEMA} \
    -g dart \
    -o /local/clients/dart

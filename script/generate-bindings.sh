#!/bin/sh
set -e

SCHEMA=reference/pulseox-data-collector.v1.json

printf "\n******************************************************\n"
printf "*\n"
printf "* Building ${OUTPUT_LANGUAGE} client.\n"
printf "*  input schema: ${SCHEMA}\n"
printf "*  output folder: clients/${OUTPUT_LANGUAGE}\n"
printf "*\n"
printf "******************************************************\n"

docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
    -i /local/${SCHEMA} \
    -g "${OUTPUT_LANGUAGE}" \
    -o "/local/clients/${OUTPUT_LANGUAGE}"

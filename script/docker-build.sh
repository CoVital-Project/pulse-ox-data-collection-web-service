#!/bin/sh
set -ex

NAME="covital/ingress:dev-latest"

docker build -t "${NAME}" .

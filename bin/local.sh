#!/usr/bin/env sh
set -e

docker build --pull -f .docker/Dockerfile -t edde-js-ssr:local .
docker-compose -f .docker/docker.local.yml up -d
docker exec -it edde-js-ssr ash
docker-compose -f .docker/docker.local.yml down --volume

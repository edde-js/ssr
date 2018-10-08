#!/usr/bin/env bash
set -e

cd ${APP_ROOT}
envsubst < package.json.template > package.json

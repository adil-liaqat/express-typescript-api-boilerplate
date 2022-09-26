#!/usr/bin/env bash

yarn db:migrate
exec "$@"

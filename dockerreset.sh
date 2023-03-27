#!/bin/bash

docker-compose down
./buildfrontend
docker-compose build
docker-compose up -d
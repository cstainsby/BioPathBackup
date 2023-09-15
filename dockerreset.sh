#!/bin/bash

docker-compose down
./buildfrontend.sh
docker-compose build
docker-compose up -d
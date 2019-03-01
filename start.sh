#!/bin/bash

docker-compose stop
docker image rm -f social-backend social-db
docker-compose up --build

#!/bin/bash

docker image prune -f
docker-compose stop
docker image rm -f social-frontend social-backend social-db
docker container rm -f social-frontend 
docker container rm -f social-backend 
docker container rm -f social-db
docker-compose up --build

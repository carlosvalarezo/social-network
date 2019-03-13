#!/bin/bash

export BACKEND_ADDRESS=http://localhost
export BACKEND_PORT=5000
export FRONTEND_ADDRESS=http://localhost
export FRONTEND_PORT=3000
docker-compose stop
docker image rm -f social-frontend social-backend social-db
docker container rm -f social-frontend 
docker container rm -f social-backend 
docker container rm -f social-db
docker image prune -f
docker rmi -f $(docker images -f "dangling=true" -q)
docker-compose up --build
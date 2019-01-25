FROM node:11.6.0-alpine
WORKDIR /code/
ADD ./app/ /code/
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /code/wait
RUN ./scripts/setup_project.sh
CMD npm run server
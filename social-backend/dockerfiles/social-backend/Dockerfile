FROM node:11.6.0-alpine
ADD ./app/ /code/
WORKDIR /code/
RUN ./scripts/setup_project.sh
CMD npm run server
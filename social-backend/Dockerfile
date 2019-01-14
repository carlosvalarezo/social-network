FROM node:11.6.0-alpine
WORKDIR /code
COPY ./app/ /code/
RUN npm install
# RUN npm run server
# CMD ["npm run server"]
CMD ["node", "./src/server.js"]

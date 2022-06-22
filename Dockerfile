FROM node:14.18.3-alpine3.15

ARG NODE_ENV=development

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/server

RUN npm install

WORKDIR /usr/src/app/client

RUN npm install

RUN npm run build

WORKDIR /usr/src/app/server

CMD ["npm","start"]
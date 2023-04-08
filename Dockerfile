FROM node:18-alpine as base

RUN apk update && apk add bash && apk add curl

RUN mkdir /usr/app
WORKDIR /usr/app
COPY . /usr/app

RUN npm install

RUN npm run lint
RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start"]

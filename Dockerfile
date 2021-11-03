FROM node:14

RUN mkdir -p /usr/app/image-serving-api
WORKDIR /usr/app/image-serving-api

COPY package.json .
RUN npm install

COPY . .
CMD npm run dev
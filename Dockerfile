FROM node:14

WORKDIR /image-serving-api
COPY package.json .
RUN npm install
COPY . .
CMD npm run dev
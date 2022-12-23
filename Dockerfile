FROM node:16.17-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


COPY . .

EXPOSE 5001

CMD [ "npm", "start" ]
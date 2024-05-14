FROM node:20-alpine

WORKDIR /tour-travel/backend

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .

RUN npm run build-src

CMD [ "npm","run","build" ]

FROM node:14.18.1-alpine3.12
RUN mkdir /home/app
WORKDIR /home/app
COPY ["package.json","./"]
RUN npm install
COPY . .

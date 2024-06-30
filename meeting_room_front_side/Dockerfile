FROM node:alpine

RUN mkdir -p /usr/src/app
ENV PORT 3000

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install --production

COPY . /usr/src/app

# RUN npm run build  "Need a way to connect to prd env

EXPOSE 3000
CMD [ "npm", "start" ]
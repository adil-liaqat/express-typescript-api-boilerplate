FROM node:16.15.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN yarn install

COPY . /usr/src/app
RUN yarn build

ENV NODE_ENV docker

EXPOSE 3000

CMD [ "yarn", "start" ]

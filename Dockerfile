FROM node:16.15.1-alpine as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN yarn install

COPY . /usr/src/app
RUN yarn build

EXPOSE 3000

FROM build as test
CMD [ "yarn", "test" ]

FROM build as prod
ENV NODE_ENV production
CMD [ "yarn", "start" ]

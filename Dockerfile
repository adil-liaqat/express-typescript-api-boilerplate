FROM node:16.15.1-slim as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/

EXPOSE 3000

FROM build as dev
RUN yarn install
COPY . /usr/src/app
RUN yarn build
CMD [ "yarn", "dev" ]


FROM dev as test
CMD [ "yarn", "test" ]


FROM build as prod
RUN yarn install --production=true
COPY .sequelizerc /usr/src/app/
COPY public /usr/src/app/public
COPY locales /usr/src/app/locales
COPY templates /usr/src/app/templates
COPY --from=dev /usr/src/app/dist /usr/src/app/dist
ENV NODE_ENV production
CMD [ "yarn", "start" ]

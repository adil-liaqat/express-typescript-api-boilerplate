FROM node:16.15.1-slim as build

RUN apt-get update || : && apt-get install python3 make gcc g++ bash -y

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/

EXPOSE 3000

FROM build as dev
RUN yarn install
COPY . /usr/src/app
RUN yarn build
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "yarn", "dev", "-L" ]

FROM dev as test
CMD [ "yarn", "test" ]

FROM build as prod
RUN yarn install --production=true
COPY .sequelizerc ./
COPY public ./public
COPY locales ./locales
COPY templates ./templates
COPY --from=dev /usr/src/app/dist ./dist
ENV NODE_ENV production
CMD [ "yarn", "start" ]

Typescript and Express.js Api
==============================

An Express.js project implemented using Typescript for api creation:

# Installation

#### Clone the repository
```sh
git clone https://github.com/adil-liaqat/express-typescript-api-boilerplate.git
```

```sh
cd express-typescript-api-boilerplate
```
#### Install yarn

```sh
npm install -g yarn
```

#### Install Dependencies
```
yarn install
```

#### Build to `./dist`
```
yarn build
```

#### For development:
```
yarn dev
```

#### To start:
```
yarn start
```

#### Test:

Before running `test` create a local postgres database with the name `local_test`
```
yarn test
```

#### Test Watch:
```
yarn test:watch
```

Browse to http://localhost:3000/health
<br/><br/>

# Folder structure

```
locale/
├── en
│   └── joi.json
│   └── transalation.json
└── ar
    └── joi.json
    └── transalation.json
public/
├── favicon.ico
└── stylesheets
    └── style.css
templates/
├── email-confirmation.ejs
└── forgot-password.ejs
src/
├── config
│   └── database.ts
│   └── i18n.ts
│   └── mailer.ts
│   └── passport.ts
│   └── swagger.ts
├── controllers
│   └── user.controller.ts
│   └── auth.controller.ts
├── helpers
│   └── index.ts
├── types
│   ├── controllers
│   │   └── auth.interface.ts
│   ├── express
│   │   └── index.ts
│   ├── i18next
│   │   └── index.ts
│   ├── i18next-fs-backend
│   │   └── index.d.ts
│   ├── i18next-http-middleware
│   │   └── index.d.ts
│   ├── jwt
│   │   └── payload.interface.ts
│   ├── models
│   │   └── index.d.ts
│   │   └── refreshToken.interface.ts
│   │   └── user.interface.ts
│   ├── sequelize
│   │   └── index.d.ts
│   ├── templates
│   │   └── index.ts
│   └── global.ts
├── models
│   └── index.ts
│   └── refreshToken.model.ts
│   └── user.model.ts
├── routes
│   └── index.ts
│   └── auth.route.ts
│   └── user.route.ts
├── validators
│   └── auth.validator.ts
│   └── common.validator.ts
├── server
│   └── index.ts
├── middlewares
│   └── authenticated.middleware.ts
│   └── clsHooked.middleware.ts
│   └── common.middleware.ts
│   └── error.middleware.ts
│   └── language.middleware.ts
│   └── notFound.middleware.ts
│   └── swagger.middleware.ts
│   └── validator.middleware.ts
├── logger
│   └── index.ts
├── migrations
│   └── 20201129002122-user-table.ts
│   └── 20210312234046-refresh-token-table.ts
├── tsconfig.json
├── index.ts
```

# Docker

Build the image `sudo docker build -t expressapi/express-api-typescript-starter .`

Run the image `docker-compose up`

Open `http://localhost:3000/health`


# License

MIT


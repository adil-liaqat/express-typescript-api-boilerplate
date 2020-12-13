Typescript and Express.js Api
==============================

An Express.js project implemented using Typescript for api creation:

# Installation

Clone the repository

```
npm install 
```

For development:
```
npm run dev
```

To start:
```
npm run start
```

To debug in visual studio code:
```
npm run debug
```

Then run the `launch.json` configuration inside visual studio code `f5`.  You should now be able to set breakpoints in your typescript.

Test
```
npm run test
```

Test Watch
```
npm run test:watch
```

Build to `./dist`
```
npm run build
```

Browse to http://localhost:3000/api/v1/users


# Folder structure

```
src/
├── config
│   └── database.ts
│   └── passport.ts
│   └── swagger.ts
├── controllers
│   └── user.controller.ts
│   └── auth.controller.ts
├── helpers
│   └── index.ts
├── interfaces
│   └── express
│       └── index.ts
│   └── jwt
│       └── payload.interface.ts
│   └── models
│       └── user.interface.ts
│   └── controllers
│       └── auth.interface.ts
├── models
│   └── index.ts
│   └── user.model.ts
├── public
│   ├── favicon.ico
│   └── stylesheets
│       └── style.css
├── routes
│   └── index.ts
│   └── auth.route.ts
│   └── user.route.ts
├── validators
│   └── auth.validator.ts
├── server
│   └── index.ts
├── middlewares
│   └── error.middleware.ts
│   └── authenticated.middleware.ts
│   └── validator.middleware.ts
│   └── notFound.middleware.ts
│   └── swagger.middleware.ts
├── logger
│   └── index.ts
├── exceptions
│   └── http.exception.ts
├── migrations
│   └── 20201129002122-user-table.ts
├── tsconfig.json
├── index.ts
```

# Docker

Build the image `sudo docker build -t expressapi/express-api-typescript-starter .`

Run the image `docker-compose up`

Open `http://localhost:8080/api/v1/users`


# License

MIT


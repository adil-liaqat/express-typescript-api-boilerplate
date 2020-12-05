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

Browse to http://localhost:3000


# Folder structure

```
src/
├── config
│   └── database.ts
├── controllers
│   └── user.controller.ts
├── helpers
│   └── index.ts
├── models
│   └── index.ts
│   └── user.model.ts
├── public
│   ├── favicon.ico
│   └── stylesheets
│       └── style.css
├── routes
│   └── user.route.ts
├── server
│   └── index.ts
├── middlewares
│   └── error.middleware.ts
├── logger
│   └── index.ts
├── exceptions
│   └── http.exception.ts
├── migrations
│   └── 20201129002122-user-table.ts
├── tsconfig.json
├── swagger.json
├── index.ts
```

# Docker

Build the image `sudo docker build -t expressapi/express-api-typescript-starter .`

Run the image `docker-compose up`

Open `http://localhost:8080`


# License

MIT


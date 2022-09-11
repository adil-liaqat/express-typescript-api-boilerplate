import { Application } from 'express'

import isAuthenticatedMiddleware from '../middlewares/authenticated.middleware'
import notFoundMiddlware from '../middlewares/notFound.middlware'
import authRoute from './auth.route'
import userRoute from './user.route'

export default function (app: Application) {
  const rootPath: string = '/api/v1'

  app.use(rootPath + '/auth', authRoute)
  app.use(isAuthenticatedMiddleware)
  app.use(rootPath + '/users', userRoute)

  app.use(notFoundMiddlware)
}

import { Application, Request, Response } from 'express'

import isAuthenticatedMiddleware from '../middlewares/authenticated.middleware'
import notFoundMiddlware from '../middlewares/notFound.middlware'
import authRoute from './auth.route'
import userRoute from './user.route'

export default function (app: Application) {
  const rootPath: string = '/api/v1'

  app.use('/health', (_req: Request, res: Response) =>
    res.status(200).json({
      uptime: process?.uptime?.(),
      env: process.env.NODE_ENV,
      status: 'healthy',
      timestamp: Date.now()
    })
  )

  app.use(rootPath + '/auth', authRoute)
  app.use(isAuthenticatedMiddleware)
  app.use(rootPath + '/users', userRoute)

  app.use(notFoundMiddlware)
}

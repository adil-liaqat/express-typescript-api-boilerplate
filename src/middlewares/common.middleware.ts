import { NextFunction, Request, Response } from 'express'
import { v4 } from 'uuid'

export default (req: Request, _res: Response, next: NextFunction): void => {
  req.app.locals.baseUrl = req.protocol + '://' + req.headers.host
  global.baseUrl = req.app.locals.baseUrl
  const correlationId: string = v4()
  req.correlationId = correlationId
  next()
}

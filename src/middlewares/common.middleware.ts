import { INextFunction, IRequest, IResponse } from '../types/express'

export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  req.app.locals.baseUrl = req.protocol + '://' + req.headers.host
  global.baseUrl = req.app.locals.baseUrl
  next()
}

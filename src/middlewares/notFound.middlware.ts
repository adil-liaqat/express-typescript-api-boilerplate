import boom from '@hapi/boom'
import { NextFunction, Request, Response } from 'express'
import i18next from 'i18next'

export default (_req: Request, _res: Response, next: NextFunction): void => {
  next(boom.notFound(i18next.t('NOT_FOUND')))
}

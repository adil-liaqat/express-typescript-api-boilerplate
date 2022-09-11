import boom, { Boom } from '@hapi/boom'
import { CelebrateError } from 'celebrate'
import { NextFunction, Request, Response } from 'express'
import i18next from 'i18next'
import { UniqueConstraintError } from 'sequelize'

import { getLanguage } from './clsHooked.middleware'

export default (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  let code: number = 500
  let message: string = err.message || i18next.t('SOMETHING_WENT_WRONG')
  let errorCode: string = ''
  let extraData = {}

  if (err instanceof Boom) {
    code = err.output?.payload?.statusCode
    errorCode = err.output?.payload?.error
    extraData = err.data
  }

  if (err instanceof UniqueConstraintError) {
    message = err.errors && i18next.t('MUST_BE_UNIQUE', { field: err.errors[0].path })
    errorCode = 'UniqueConstraintError'
    code = 422
  }

  if (code === 500) {
    console.error(err.stack)
  }

  res.status(code).send({
    message,
    errorCode,
    ...extraData,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export const celebrateErrorI18nMiddleware = (
  err: CelebrateError,
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!(err instanceof CelebrateError)) {
    return next(err)
  }

  const [firstError] = err.details.values()

  const locale = getLanguage()

  const localeMessage = i18next.t(firstError.details[0].type, {
    lng: locale,
    ns: 'joi',
    ...(firstError.details?.[0]?.context || {})
  })

  next(boom.badData(localeMessage, { errorCode: firstError.name }))
}

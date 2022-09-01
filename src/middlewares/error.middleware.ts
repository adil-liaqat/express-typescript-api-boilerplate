import { Boom } from '@hapi/boom'
import { CelebrateError } from 'celebrate'
import { UniqueConstraintError } from 'sequelize'

import HttpException from '../exceptions/http.exception'
import { INextFunction, IRequest, IResponse } from '../types/express'

export default (err: HttpException, req: IRequest, res: IResponse, next: INextFunction): void => {
  let code: number = err.status || 500
  let message: string = err.message || req.i18n.t('SOMETHING_WENT_WRONG')
  let errorCode: string = ''

  if (err instanceof Boom) {
    code = err.output?.payload?.statusCode
    errorCode = err.output?.payload?.error
  }

  if (err instanceof UniqueConstraintError) {
    message = err.errors && req.i18n.t('MUST_BE_UNIQUE', { field: err.errors[0].path })
    errorCode = 'UniqueConstraintError'
    code = 422
  }

  if (err instanceof CelebrateError) {
    const [firstError] = err.details.values()
    message = firstError.message
    errorCode = firstError.name
    code = 422
  }

  if (code === 500) {
    console.error(err.stack)
  }

  res.status(code).send({
    message,
    errorCode,
    ...process.env.NODE_ENV === 'development' && { stack: err.stack }
  })
}

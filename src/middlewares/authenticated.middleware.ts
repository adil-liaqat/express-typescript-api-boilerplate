import boom from '@hapi/boom'
import i18next from 'i18next'
import { TokenExpiredError } from 'jsonwebtoken'
import passport from 'passport'

import { INextFunction, IRequest, IResponse } from '../types/express'
import { User } from '../types/models'
import { setUser } from './clsHooked.middleware'

export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  passport.authenticate('jwt', (error: Error, user: User, info: any) => {
    if (error) {
      return next(error)
    }

    if (info instanceof TokenExpiredError) {
      return next(boom.unauthorized(i18next.t('TOKEN_EXPIRED')))
    }

    if (!user) {
      throw boom.unauthorized(i18next.t('UNAUTHORIZED_USER'))
    }

    req.user = user
    setUser(user)

    next()
  })(req, res, next)
}

import boom from '@hapi/boom'
import passport from 'passport'

import { INextFunction, IRequest, IResponse } from '../types/express'
import { User } from '../types/models'

export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  passport.authenticate('jwt', (error: Error, user: User) => {
    if (error) {
      return next(error)
    }
    if (!user) {
      throw boom.unauthorized(req.i18n.t('UNAUTHORIZED_USER'))
    }

    req.user = user
    next()
  })(req, res, next)
}

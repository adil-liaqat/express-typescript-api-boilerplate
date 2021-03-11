import httpErrors from 'http-errors';
import passport from 'passport';

import { INextFunction, IRequest, IResponse } from '../interfaces/express';
import { User } from '../interfaces/models/user.interface';


import {i18next} from '../config/i18n';

export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  passport.authenticate('jwt', (error: Error, user: User) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      throw new httpErrors.Unauthorized(i18next.t('UNAUTHORIZED_USER'));
    }

    req.user = user;
    next();
  })(req, res, next);
}

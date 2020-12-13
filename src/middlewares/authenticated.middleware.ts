import * as httpErrors from 'http-errors';
import * as passport from 'passport';

import { INextFunction, IRequest, IResponse } from '../interfaces/express';
import { User } from '../interfaces/models/user.interface';


export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  passport.authenticate('jwt', (error: Error, user: User) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      throw new httpErrors.Unauthorized('Unauthorized user.');
    }

    req.user = user;
    next();
  })(req, res, next);
}

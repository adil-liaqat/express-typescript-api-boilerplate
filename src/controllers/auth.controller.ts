import * as passport from 'passport';

import { db } from '../models';
import { User } from '../interfaces/models/user.interface';

import { IRequest, IResponse, INextFunction } from '../interfaces/express';
import { UserRegister } from '../interfaces/controllers/auth.interface';


export default class AuthController {
  public async login(req: IRequest, res: IResponse, next: INextFunction): Promise<any> {
    passport.authenticate('local', { session: false }, (error: Error, user: User) => {
      if (error) next(error);
      res.json(user);
    })(req, res, next);
  }

  public async register(req: IRequest, res: IResponse): Promise<any> {
    const data: UserRegister = <UserRegister>req.body;
    const user: User = await db.User.create(data);
    res.json(user.toJSON());
  }
}

export const authController = new AuthController();

import passport from 'passport';
import httpErrors from 'http-errors';
import moment from 'moment';

import { randomString } from '../helpers';
import sendMail from '../config/mailer';
import { db } from '../models';
import { User } from '../interfaces/models/user.interface';

import { IRequest, IResponse, INextFunction } from '../interfaces/express';
import { UserRegister, UserVerify, UserBodyEmail } from '../interfaces/controllers/auth.interface';
import { Templates } from '../interfaces/templates';

import { i18next } from '../config/i18n';

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

  public async verify(req: IRequest, res: IResponse): Promise<any> {
    const {token}: UserVerify = <UserVerify><unknown>req.params;
    const user: User = await db.User.findOne({
      where: {
        confirmation_token: token,
      },
    });

    if (!user) {
      throw new httpErrors.BadRequest(i18next.t('INVALID_TOKEN'));
    }

    if (user.verified) {
      throw new httpErrors.Conflict(i18next.t('USER_ALREADY_VERIFIED'));
    }

    if (moment().isSameOrAfter(user.confirmation_expires_at)) {
      throw new httpErrors.Gone(i18next.t('CONFIRMATION_LINK_EXPIRED'));
    }

    user.confirmation_token = null;
    user.confirmation_expires_at = null;
    user.verified = true;

    await user.save();

    res.json(user.toJSON());
  }

  public async forgotPassword(req: IRequest, res: IResponse): Promise<any> {
    const {email}: UserBodyEmail = <UserBodyEmail>req.body;
    const user: User = await db.User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new httpErrors.NotFound(i18next.t('USER_NOT_FOUND'));
    }

    user.reset_password_expires_at = moment().add(1, 'hour').toDate();
    user.reset_password_token = randomString();

    await user.save();

    sendMail({
      template: Templates.forgotPassword,
      data: user.get(),
      subject: i18next.t('FORGOT_PASSWORD'),
      to: `${user.full_name} <${user.email}>`,
    })

    res.json({'message': i18next.t('EMAIL_SENT')});
  }

  public async resetPassword(req: IRequest, res: IResponse): Promise<any> {
    const {token}: UserVerify = <UserVerify><unknown>req.params;
    const {password} = req.body;

    const user: User = await db.User.findOne({
      where: {
        reset_password_token: token,
      },
    });

    if (!user) {
      throw new httpErrors.BadRequest(i18next.t('INVALID_TOKEN'));
    }

    if (moment().isSameOrAfter(user.reset_password_expires_at)) {
      throw new httpErrors.Gone(i18next.t('RESET_LINK_EXPIRED'));
    }

    user.reset_password_expires_at = null;
    user.reset_password_token = null;
    user.password = password;


    await user.save();

    res.json({'message': i18next.t('PASSWORD_RESET_SUCCESSFULLY')});
  }
}

export const authController = new AuthController();

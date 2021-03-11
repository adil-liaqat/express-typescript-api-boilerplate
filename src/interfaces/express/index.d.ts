import {Request, Response, NextFunction} from 'express';
import { User } from '../models/user.interface';

import { i18n } from 'i18next';

export interface IRequest extends Request {
  user: User
  i18n: i18n
}

export interface IResponse extends Response {
}

export interface INextFunction extends NextFunction {
}

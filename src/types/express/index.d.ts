import { NextFunction, Request, Response } from 'express'
import { i18n } from 'i18next'

import { User } from '../models/user.interface'

export interface IRequest extends Request {
  user: User
  i18n: i18n
}

export interface IResponse extends Response {
}

export interface INextFunction extends NextFunction {
}

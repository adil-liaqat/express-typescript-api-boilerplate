import { NextFunction, Request, Response } from 'express'
import { i18n } from 'i18next'

import { User } from '../models/user.interface'

export interface IRequest extends Request {
  user: User
  i18n: i18n
  correlationId: string
}

export interface IResponse extends Response {
  locals: {
    isResponseHandled?: boolean
    [x: string]: any
  }
}

export interface INextFunction extends NextFunction {}

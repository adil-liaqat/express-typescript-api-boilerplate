import { i18n } from 'i18next'

import { User } from '../models'
declare module 'express' {
  interface Request {
    user: User
    i18n: i18n
    correlationId: string
  }
  interface Response {
    locals: {
      isResponseHandled?: boolean
      [x: string]: any
    }
  }
}

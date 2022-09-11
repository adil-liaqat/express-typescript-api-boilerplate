import core from 'express-serve-static-core'
import { i18n } from 'i18next'

import { User } from '../models'
declare module 'express' {
  export interface Request {
    user: User
    i18n: i18n
    correlationId: string
  }
  export interface Response<ResBody = any, Locals extends Record<string, any> = Record<string, any>>
    extends core.Response<ResBody, Locals> {
    // provide locals customization here, ensuring you & Locals
    locals: {
      isResponseHandled?: boolean
    } & Locals
  }
}

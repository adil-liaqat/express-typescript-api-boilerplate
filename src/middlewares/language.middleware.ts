import { NextFunction, Request, Response } from 'express'

import { SUPPORTED_LANGUAGES } from '../config/app'
import { setLanguage } from './clsHooked.middleware'

export default (req: Request, _res: Response, next: NextFunction): void => {
  let lang = (req.query.lng || req.acceptsLanguages()?.[0] || 'en') as string

  lang = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en'

  setLanguage(lang)
  next()
}

import { SUPPORTED_LANGUAGES } from '../config/app'
import { INextFunction, IRequest, IResponse } from '../types/express'
import { setLanguage } from './clsHooked.middleware'

export default (req: IRequest, _res: IResponse, next: INextFunction): void => {
  let lang = (req.query.lng || req.acceptsLanguages()?.[0] || 'en') as string
  const supportedLngs = SUPPORTED_LANGUAGES

  lang = supportedLngs.includes(lang) ? lang : 'en'

  setLanguage(lang)
  next()
}

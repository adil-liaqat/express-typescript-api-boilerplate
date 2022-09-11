import i18next, { InitOptions, TFunction } from 'i18next'
import backend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'
import path from 'path'
import shimmer from 'shimmer'

import { getLanguage } from '../middlewares/clsHooked.middleware'
import { SUPPORTED_LANGUAGES } from './app'

const options: InitOptions = {
  backend: {
    loadPath: path.join(__dirname, '..', '..', 'locales', '{{lng}}', '{{ns}}.json'),
    addPath: path.join(__dirname, '..', '..', 'locales', '{{lng}}', '{{ns}}.missing.json')
  },
  debug: process.env.NODE_ENV !== 'production',
  supportedLngs: SUPPORTED_LANGUAGES,
  ns: ['translation', 'joi'],
  preload: ['en', 'ar'],
  fallbackLng: 'en',
  detection: {
    order: ['querystring', 'header']
  },
  saveMissing: process.env.NODE_ENV === 'development'
}

i18next.use(middleware.LanguageDetector).use(backend).init(options)

// Override i18next.t function to set request language
shimmer.wrap(i18next, 't', function (original: TFunction) {
  return function (...args: any[]) {
    const locale = getLanguage()

    args[1] = { lng: locale, ...(args[1] || {}) }

    return original.apply(this, args)
  }
})

export { i18next, middleware }

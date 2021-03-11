import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import backend from 'i18next-fs-backend';
import path from 'path';

i18next
  .use(middleware.LanguageDetector)
  .use(backend)
  .init({
    backend: {
      loadPath: path.join(__dirname, '..', '..', 'src', 'locales', '{{lng}}', '{{ns}}.json'),
      addPath: path.join(__dirname, '..', '..', 'src', 'locales', '{{lng}}', '{{ns}}.missing.json'),
    },
    debug: true,
    preload: ['en'],
    fallbackLng: 'en',
    detection: {
      order: ['querystring', 'cookie'],
    },
    saveMissing: process.env.NODE_ENV === 'development',
  });

export {
  i18next,
  middleware,
}

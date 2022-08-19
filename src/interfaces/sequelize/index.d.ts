export { };
import { i18n } from 'i18next';

interface IContext {
  i18n?: i18n
  [x: string]: any
}

declare module 'sequelize' {
  interface CreateOptions {
    context?: IContext
  }
  interface FindOptions {
    context?: IContext
  }

  interface SaveOptions {
    context?: IContext
  }

  interface InstanceDestroyOptions {
    context?: IContext
  }
}

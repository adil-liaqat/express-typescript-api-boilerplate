import boom from '@hapi/boom'
import i18next from 'i18next'

import { INextFunction, IRequest, IResponse } from '../types/express'

export default (_req: IRequest, _res: IResponse, next: INextFunction): void => {
  next(boom.notFound(i18next.t('NOT_FOUND')))
}

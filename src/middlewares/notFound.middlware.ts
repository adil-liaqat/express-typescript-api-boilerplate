import httpErrors from 'http-errors';

import { INextFunction, IRequest, IResponse } from '../interfaces/express';
import { i18next } from '../config/i18n';


export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  throw new httpErrors.NotFound(i18next.t('NOT_FOUND'));
}

import httpErrors from 'http-errors';

import { INextFunction, IRequest, IResponse } from '../types/express';

export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  throw new httpErrors.NotFound(req.i18n.t('NOT_FOUND'));
}

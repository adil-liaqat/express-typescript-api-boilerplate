import * as httpErrors from 'http-errors';

import { INextFunction, IRequest, IResponse } from '../interfaces/express';


export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  throw new httpErrors.NotFound('Not found.');
}

import { UniqueConstraintError } from 'sequelize';
import HttpException from '../exceptions/http.exception';
import { INextFunction, IRequest, IResponse } from '../interfaces/express';

import { i18next } from '../config/i18n';

export default (err: HttpException, req: IRequest, res: IResponse, next: INextFunction): void => {
  let code: number = err.status || 500;

  if (err instanceof UniqueConstraintError) {
    err.message = err.errors && i18next.t('MUST_BE_UNIQUE', {field: err.errors[0].path});
    code = 422;
  }

  if (code === 500) {
    console.error(err.stack);
  }

  res.status(code).send({message: err.message || i18next.t('SOMETHING_WENT_WRONG')});
}

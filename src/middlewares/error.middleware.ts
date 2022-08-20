import { CelebrateError } from 'celebrate';
import { UniqueConstraintError } from 'sequelize';
import HttpException from '../exceptions/http.exception';
import { INextFunction, IRequest, IResponse } from '../types/express';

export default (err: HttpException, req: IRequest, res: IResponse, next: INextFunction): void => {
  let code: number = err.status || 500;

  if (err instanceof UniqueConstraintError) {
    err.message = err.errors && req.i18n.t('MUST_BE_UNIQUE', { field: err.errors[0].path });
    code = 422;
  }

  if (err instanceof CelebrateError) {
    const [firstError] = err.details.values()
    err.message = firstError.message
    code = 422;
  }

  if (code === 500) {
    console.error(err.stack);
  }

  res.status(code).send({ message: err.message || req.i18n.t('SOMETHING_WENT_WRONG') });
}

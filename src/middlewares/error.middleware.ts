import { UniqueConstraintError } from 'sequelize';
import HttpException from '../exceptions/http.exception';
import { INextFunction, IRequest, IResponse } from '../interfaces/express';

export default (err: HttpException, req: IRequest, res: IResponse, next: INextFunction): void => {
  let code: number = err.status || 500;

  if (err instanceof UniqueConstraintError) {
    err.message = err.errors && err.errors[0].message;
    code = 400;
  }

  if (code === 500) {
    console.error(err.stack);
  }

  res.status(code).send({message: err.message || 'Something went wrong'});
}

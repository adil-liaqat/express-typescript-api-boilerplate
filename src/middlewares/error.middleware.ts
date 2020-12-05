import HttpException from '../exceptions/http.exception';
import { NextFunction, Request, Response } from 'express';

export default (err: HttpException, req: Request, res: Response, next: NextFunction): void => {
  const code = err.status || 500;

  if (code === 500) {
    console.error(err.stack);
  }

  res.status(code).send({message: err.message || 'Something went wrong'});
}

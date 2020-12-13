import * as httpErrors from 'http-errors';
import * as Joi from 'joi';

import { IRequest, IResponse, INextFunction } from '../interfaces/express';


type Body = 'body' | 'query' | 'params'

/**
 * @param {Joi.Schema} schema Joi schema to validate
 * @param {object} body Response to validate with. Default is body
 */
export default (schema: Joi.Schema, body: Body = 'body') => (req: IRequest, res: IResponse, next: INextFunction): void => {
  const { error } = schema.validate(req[body]);
  if (error) {
    return next(new httpErrors.UnprocessableEntity(error.message));
  }
  next();
}

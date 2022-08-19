import httpErrors from 'http-errors';
import Joi from 'joi';

import { IRequest, IResponse, INextFunction } from '../interfaces/express';


type Body = 'body' | 'query' | 'params' | 'cookies'

interface Schema extends Joi.AnySchema {
  query?: Joi.Schema,
  params?: Joi.Schema,
  body?: Joi.Schema,
  cookies?: Joi.Schema,
}

/**
 * @param {Joi.Schema} schema Joi schema to validate
 * @param {object} body Response to validate with. Default is body
 */
export default (fn: Function, body: Body = 'body') => (req: IRequest, res: IResponse, next: INextFunction): void => {
  const schema: Schema = fn(req.i18n);
  let dataToValidate: any = {};
  /* tslint:disable:no-empty */
  try {
    schema.params = schema.extract('params');
  } catch (error) {}

  try {
    schema.body = schema.extract('body');
  } catch (error) {}

  try {
    schema.query = schema.extract('query');
  } catch (error) {}

  try {
    schema.cookies = schema.extract('cookies');
  } catch (error) {}

  if (schema.body || schema.params || schema.query || schema.cookies) {
    ['query', 'params', 'body', 'cookies'].forEach((k: Body) => {
      if (schema[k]) {
        dataToValidate[k] = req[k];
      }
    })
  } else {
    dataToValidate = req[body];
  }

  const { error } = schema.validate(dataToValidate);
  if (error) {
    return next(new httpErrors.UnprocessableEntity(error.message));
  }
  next();
}

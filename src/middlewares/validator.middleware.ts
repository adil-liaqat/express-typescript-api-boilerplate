import { celebrate, SchemaOptions } from 'celebrate'

import { INextFunction, IRequest, IResponse } from '../types/express'

/**
 * @param {Joi.Schema} schema Joi schema to validate
 * @param {object} body Response to validate with. Default is body
 */
export default (fn: Function) => (req: IRequest, res: IResponse, next: INextFunction): void => {
  const schema: SchemaOptions = fn(req.i18n)
  celebrate(schema)(req, res, next)
}

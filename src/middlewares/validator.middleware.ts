import { celebrate, SchemaOptions } from 'celebrate'

import { INextFunction, IRequest, IResponse } from '../types/express'

/**
 * @param {Joi.Schema} schema Joi schema to validate
 * @param {object} body Response to validate with. Default is body
 */
export default (schema: SchemaOptions) => (req: IRequest, res: IResponse, next: INextFunction): void => {
  celebrate(schema)(req, res, next)
}

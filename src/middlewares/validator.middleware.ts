import { celebrate, SchemaOptions } from 'celebrate'

import { INextFunction, IRequest, IResponse } from '../types/express'

/**
 * @param schema Joi schema to validate
 */
export default (schema: SchemaOptions) =>
  (req: IRequest, res: IResponse, next: INextFunction): void => {
    celebrate(schema)(req, res, next)
  }

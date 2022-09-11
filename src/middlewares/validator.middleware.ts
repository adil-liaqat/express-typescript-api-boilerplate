import { celebrate, SchemaOptions } from 'celebrate'
import { NextFunction, Request, Response } from 'express'

/**
 * @param schema Joi schema to validate
 */
export default (schema: SchemaOptions) =>
  (req: Request, res: Response, next: NextFunction): void => {
    celebrate(schema)(req, res, next)
  }

import { NextFunction, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { options } from '../config/swagger'

const specs = swaggerJsdoc(options)

export default (req: Request, res: Response, next: NextFunction): void => {
  swaggerUi.setup(specs)(req, res, next)
}

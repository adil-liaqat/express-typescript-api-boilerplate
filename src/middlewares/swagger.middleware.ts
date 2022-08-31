import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { options } from '../config/swagger'
import { INextFunction, IRequest, IResponse } from '../types/express'

const specs = swaggerJsdoc(options)

export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  swaggerUi.setup(specs)(req, res, next)
}

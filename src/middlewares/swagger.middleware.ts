import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


import { INextFunction, IRequest, IResponse } from '../interfaces/express';
import { options } from '../config/swagger';

const specs = swaggerJsdoc(options);

export default (req: IRequest, res: IResponse, next: INextFunction): void => {
  swaggerUi.setup(specs)(req, res, next);
}

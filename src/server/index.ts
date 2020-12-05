import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as path from 'path';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as swaggerUi from 'swagger-ui-express';

import * as swaggerDocument from '../swagger.json';

import errorMiddleware from '../middlewares/error.middleware';

import routes from '../routes';

import {myStream} from '../logger';

const app: express.Express = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: myStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../src/public')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

routes(app);

app.use(errorMiddleware);

export default app;

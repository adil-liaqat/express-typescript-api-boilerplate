import '../config/passport'

import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import swaggerUi from 'swagger-ui-express'

import { i18next, middleware } from '../config/i18n'
import { myStream } from '../logger'
import clsHookedMiddleware from '../middlewares/clsHooked.middleware'
import commonMiddleware from '../middlewares/common.middleware'
import errorMiddleware, { celebrateErrorI18nMiddleware } from '../middlewares/error.middleware'
import langMiddleware from '../middlewares/language.middleware'
import swaggerMiddleware from '../middlewares/swagger.middleware'
import routes from '../routes'

const app: express.Express = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(morgan('combined', { stream: myStream }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../../public')))
app.set('trust proxy', true)

app.use(middleware.handle(i18next))

app.use('/docs', swaggerUi.serve, swaggerMiddleware)

app.use(clsHookedMiddleware)
app.use(langMiddleware)
app.use(commonMiddleware)

routes(app)

app.use(celebrateErrorI18nMiddleware)
app.use(errorMiddleware)

export default app

import { i18next, middleware } from '@src/config/i18n'
import swaggerMiddleware from '@src/middlewares/swagger.middleware'
import { expect } from 'chai'
import { createRequest, createResponse, MockRequest } from 'node-mocks-http'
import sinon from 'sinon'

import { cleanUpDatabase } from '../utils/db'

describe('Middleware swagger', () => {
  beforeEach(async() => {
    await cleanUpDatabase()
  })

  it('should return swagger html', async() => {
    middleware.handle(i18next)
    const request: MockRequest<any> = createRequest({
      method: 'GET',
      url: `${process.env.BASE_PATH}/docs`,
      i18n: i18next
    })

    const response = createResponse()
    const next = sinon.spy()

    swaggerMiddleware(request, response, next)

    const data = response._getData()

    expect(response.statusCode).to.be.eq(200)
    expect(data).to.have.string('<title>Swagger UI</title>')
  })
})

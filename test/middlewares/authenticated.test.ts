import { Boom } from '@hapi/boom'
import { i18next, middleware } from '@src/config/i18n'
import isAuthenticatedMiddleware from '@src/middlewares/authenticated.middleware'
import { expect } from 'chai'
import moment from 'moment'
import { createRequest, createResponse, MockRequest } from 'node-mocks-http'
import sinon from 'sinon'

import { cleanUpDatabase } from '../utils/db'
import { generateToken } from '../utils/helpers'

describe('Middleware authenticated', () => {
  beforeEach(async () => {
    await cleanUpDatabase()
  })

  it('should return error if invalid jwt token passed', async () => {
    middleware.handle(i18next)
    const request: MockRequest<any> = createRequest({
      method: 'GET',
      url: `${process.env.BASE_PATH}/users`,
      headers: {
        authorization: 'Bearer 123'
      },
      i18n: i18next
    })

    const response = createResponse()
    const next = sinon.spy()
    let error: Boom

    try {
      isAuthenticatedMiddleware(request, response, next)
    } catch (err) {
      error = err
    }

    expect(error.output.statusCode).to.be.eq(401)
    expect(error.output.payload.error).to.be.eq('Unauthorized')
    expect(error.output.payload.message).to.be.eq('Unauthorized user')
  })

  it('should return error if user not found', async () => {
    middleware.handle(i18next)
    const token = generateToken({
      id: 2
    })
    const request: MockRequest<any> = createRequest({
      method: 'GET',
      url: `${process.env.BASE_PATH}/users`,
      headers: {
        authorization: `Bearer ${token}`
      },
      i18n: i18next
    })

    const response = createResponse()

    isAuthenticatedMiddleware(request, response, (error) => {
      expect(error.output.statusCode).to.be.eq(401)
      expect(error.output.payload.error).to.be.eq('Unauthorized')
      expect(error.output.payload.message).to.be.eq('Unauthorized user')
    })
  })

  it('should return error if token expired', async () => {
    middleware.handle(i18next)
    const token = generateToken({
      id: 2,
      exp: moment().subtract(1, 'hour').unix()
    })
    const request: MockRequest<any> = createRequest({
      method: 'GET',
      url: `${process.env.BASE_PATH}/users`,
      headers: {
        authorization: `Bearer ${token}`
      },
      i18n: i18next
    })

    const response = createResponse()

    isAuthenticatedMiddleware(request, response, (error) => {
      expect(error.output.statusCode).to.be.eq(401)
      expect(error.output.payload.error).to.be.eq('Unauthorized')
      expect(error.output.payload.message).to.be.eq('Token expired')
    })
  })
})

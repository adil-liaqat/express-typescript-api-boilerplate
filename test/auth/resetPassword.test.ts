import { faker } from '@faker-js/faker'
import { randomString } from '@src/helpers'
import { User } from '@src/types/models'
import bcrypt from 'bcrypt'
import { expect } from 'chai'
import moment from 'moment'
import sinon from 'sinon'

import { cleanUpDatabase, generateUser } from '../utils/db'
import { buildRequest } from '../utils/helpers'

describe('POST /auth/reset/password/:token', () => {
  let user: User

  beforeEach(async() => {
    await cleanUpDatabase()
    user = await generateUser({
      reset_password_expires_at: moment().add(1, 'hour').toDate(),
      reset_password_token: randomString()
    })
  })

  afterEach(() => {
    user = null
  })

  it('should reset user password', async() => {
    const hashSpy = sinon.spy(bcrypt, 'hash')
    const password: string = faker.random.alphaNumeric(10)
    const body = {
      password,
      confirm_password: password
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/reset/password/${user.reset_password_token}`).send(body)

    expect(resp.status).to.be.eq(200)
    expect(resp.body.message).to.be.eq('Password reset successfully')
    expect(hashSpy).to.be.calledOnceWith(password)
  })

  it('should return error if user not found', async() => {
    const password: string = faker.random.alphaNumeric(10)
    const body = {
      password,
      confirm_password: password
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/reset/password/${randomString()}`).send(body)

    expect(resp.status).to.be.eq(400)
    expect(resp.body.message).to.be.eq('Invalid token')
  })

  it('should return error if token expired', async() => {
    const password: string = faker.random.alphaNumeric(10)
    const body = {
      password,
      confirm_password: password
    }

    user.reset_password_expires_at = moment().toDate()
    await user.save()

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/reset/password/${user.reset_password_token}`).send(body)

    expect(resp.status).to.be.eq(410)
    expect(resp.body.message).to.be.eq('Reset password link has expired')
  })
})

import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { expect } from 'chai'
import sinon from 'sinon'

import mailer from '../../src/config/mailer'
import logger from '../../src/logger'
import { UserRegister } from '../../src/types/controllers/auth.interface'
import { cleanUpDatabase, generateUser } from '../utils/db'
import { buildRequest } from '../utils/helpers'

describe('POST /auth/register', () => {
  beforeEach(async() => {
    await cleanUpDatabase()
  })

  it('should register user successfully', async() => {
    const sendMailSpy = sinon.spy(mailer, 'sendMail')
    const password: string = faker.random.alphaNumeric(10)

    const body: UserRegister = {
      email: faker.internet.email().toLowerCase(),
      password,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      confirm_password: password
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/register`).send(body)
    // console.error(JSON.stringify(resp.body, null, 2))
    expect(resp.status).to.be.eq(200)
    expect(resp.body).to.containSubset({
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name
    })

    expect(sendMailSpy).to.be.calledOnce()
  })

  it('should return error if email already exist', async() => {
    await generateUser({
      email: 'test@test.com'
    })

    const sendMailSpy = sinon.spy(mailer, 'sendMail')
    const password: string = faker.random.alphaNumeric(10)

    const body: UserRegister = {
      email: 'test@test.com',
      password,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      confirm_password: password
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/register`).send(body)

    expect(resp.status).to.be.eq(422)
    expect(resp.body.message).to.be.eq('email must be unique')

    expect(sendMailSpy).to.not.have.been.called()
  })

  it('should return error if password hashing failed', async() => {
    sinon.stub(bcrypt, 'hash').throws({})
    sinon.stub(logger, 'error')
    const sendMailSpy = sinon.spy(mailer, 'sendMail')
    const password: string = faker.random.alphaNumeric(10)

    const body: UserRegister = {
      email: faker.internet.email().toLowerCase(),
      password,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      confirm_password: password
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/register`).send(body)

    expect(resp.status).to.be.eq(500)
    expect(resp.body.message).to.be.eq('Unable to hash password')

    expect(sendMailSpy).to.not.have.been.called()
  })
})

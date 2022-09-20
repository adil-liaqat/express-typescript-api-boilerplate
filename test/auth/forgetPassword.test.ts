import mailer from '@src/config/mailer'
import { User } from '@src/types/models'
import { expect } from 'chai'
import sinon from 'sinon'

import { cleanUpDatabase, generateUser } from '../utils/db'
import { buildRequest } from '../utils/helpers'

describe('POST /auth/forgot_password', () => {
  beforeEach(async () => {
    await cleanUpDatabase()
  })

  it('should send forgot password email', async () => {
    const user: User = await generateUser()
    const sendMailSpy = sinon.spy(mailer, 'sendMail')

    const body = {
      email: user.email
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/forgot_password`).send(body)

    expect(resp.status).to.be.eq(200)
    expect(resp.body.message).to.be.eq('Email sent to registered email')
    expect(sendMailSpy).to.be.calledOnce()
  })

  it('should return error if email not found', async () => {
    await generateUser()
    const sendMailSpy = sinon.spy(mailer, 'sendMail')

    const body = {
      email: 'test@test.com'
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/forgot_password`).send(body)

    expect(resp.status).to.be.eq(404)
    expect(resp.body.message).to.be.eq('User not found')
    expect(sendMailSpy).to.not.have.been.called()
  })
})

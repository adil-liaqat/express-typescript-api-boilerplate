import { expect } from 'chai'
import { decode } from 'jsonwebtoken'

import { AesDecrypt } from '../../src/helpers'
import { Payload } from '../../src/types/jwt/payload.interface'
import { User } from '../../src/types/models'
import { cleanUpDatabase, generateUser } from '../utils/db'
import { buildRequest } from '../utils/helpers'

describe('POST /auth/login', () => {
  beforeEach(async() => {
    await cleanUpDatabase()
  })

  it('should login user successfully', async() => {
    const user: User = await generateUser({
      password: '123'
    })

    const body = {
      email: user.email,
      password: '123'
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/login`).send(body)

    expect(resp.status).to.be.eq(200)
    expect(resp.body).to.containSubset(JSON.parse(JSON.stringify(user.toJSON())))

    const token: string = resp.body.token

    const decodedToken = decode(AesDecrypt(token))
    expect((<Payload>decodedToken).id).to.be.eq(user.id)
    expect(resp).to.have.cookie('refresh_token')
  })

  it('should return error if email is invalid', async() => {
    await generateUser({
      password: '123'
    })

    const body = {
      email: 'test@test.com',
      password: '123'
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/login`).send(body)

    expect(resp.status).to.be.eq(401)
    expect(resp.body.message).to.be.eq('Email or password is incorrect')
  })

  it('should return error if password is incorrect', async() => {
    const user: User = await generateUser({
      password: '123'
    })

    const body = {
      email: user.email,
      password: '1234'
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/login`).send(body)

    expect(resp.status).to.be.eq(401)
    expect(resp.body.message).to.be.eq('Email or password is incorrect')
  })
})

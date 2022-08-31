import moment from 'moment'
import { expect } from 'chai'
import { decode } from 'jsonwebtoken'

import { User, RefreshToken } from '../../src/types/models'
import { cleanUpDatabase, generateRefreshToken, generateUser } from '../utils/db'
import { buildRequest, generateToken } from '../utils/helpers'
import { AesDecrypt } from '../../src/helpers'
import { Payload } from '../../src/types/jwt/payload.interface'

describe('POST /auth/token/refresh', () => {
  let user: User
  let token: string
  let refreshToken: RefreshToken

  beforeEach(async() => {
    await cleanUpDatabase()
    user = await generateUser()
    token = generateToken({
      id: user.id
    })
    refreshToken = await generateRefreshToken({
      user_id: user.id
    })
  })

  afterEach(() => {
    user = null
    token = null
    refreshToken = null
  })

  it('should return new access token', async() => {
    const body = {
      access_token: token
    }

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/token/refresh`)
      .send(body)
      .set('Cookie', `refresh_token=${refreshToken.token}`)

    expect(resp.status).to.be.eq(200)

    await refreshToken.reload()

    const newToken: string = resp.body.token

    const decodedToken = decode(AesDecrypt(newToken))
    expect((<Payload>decodedToken).id).to.be.eq(user.id)

    expect(resp).to.have.cookie('refresh_token', refreshToken.replaced_by_token)
  })

  it('should return error if refresh token expired', async() => {
    const body = {
      access_token: token
    }

    refreshToken.token_expires_at = moment().toDate()
    await refreshToken.save()

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/token/refresh`)
      .send(body)
      .set('Cookie', `refresh_token=${refreshToken.token}`)

    expect(resp.status).to.be.eq(401)
    expect(resp.body.message).to.be.eq('You have used invalid refresh token')
  })

  it('should return error if refresh token already used', async() => {
    const body = {
      access_token: token
    }

    refreshToken.is_used = true
    await refreshToken.save()

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/token/refresh`)
      .send(body)
      .set('Cookie', `refresh_token=${refreshToken.token}`)

    expect(resp.status).to.be.eq(401)
    expect(resp.body.message).to.be.eq('You have used invalid refresh token')
  })

  it('should return error if user id of token doesn\'t match', async() => {
    const newUser: User = await generateUser()
    const body = {
      access_token: token
    }

    refreshToken.user_id = newUser.id
    await refreshToken.save()

    const resp = await buildRequest('post', `${process.env.BASE_PATH}/auth/token/refresh`)
      .send(body)
      .set('Cookie', `refresh_token=${refreshToken.token}`)

    expect(resp.status).to.be.eq(401)
    expect(resp.body.message).to.be.eq('You have used invalid refresh token')
  })
})

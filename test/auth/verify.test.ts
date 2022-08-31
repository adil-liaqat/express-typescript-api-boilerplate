import { expect } from 'chai'
import moment from 'moment'

import { User } from '../../src/types/models'
import { cleanUpDatabase, generateUser } from '../utils/db'
import { buildRequest } from '../utils/helpers'
import { randomString } from '../../src/helpers'

describe('POST /auth/verify/:token', () => {
  let user: User

  beforeEach(async() => {
    await cleanUpDatabase()
    user = await generateUser({
      verified: false
    })
  })

  afterEach(() => {
    user = null
  })

  it('should verify user', async() => {
    const resp = await buildRequest('get', `${process.env.BASE_PATH}/auth/verify/${user.confirmation_token}`)

    await user.reload()

    expect(resp.status).to.be.eq(200)
    expect(resp.body).to.deep.equalInAnyOrder(JSON.parse(JSON.stringify(user.toJSON())))
  })

  it('should return error if user not found', async() => {
    const resp = await buildRequest('get', `${process.env.BASE_PATH}/auth/verify/${randomString()}`)

    expect(resp.status).to.be.eq(400)
    expect(resp.body.message).to.be.eq('Invalid token')
  })

  it('should return error if token expired', async() => {
    user.confirmation_expires_at = moment().toDate()
    await user.save()

    const resp = await buildRequest('get', `${process.env.BASE_PATH}/auth/verify/${user.confirmation_token}`)

    expect(resp.status).to.be.eq(410)
    expect(resp.body.message).to.be.eq('Confirmation link has expired')
  })

  it('should return error if user already verified', async() => {
    user.verified = true
    await user.save()

    const resp = await buildRequest('get', `${process.env.BASE_PATH}/auth/verify/${user.confirmation_token}`)

    expect(resp.status).to.be.eq(409)
    expect(resp.body.message).to.be.eq('User is already verified')
  })
})

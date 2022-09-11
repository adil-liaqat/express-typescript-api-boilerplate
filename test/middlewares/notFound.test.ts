import { User } from '@src/types/models'
import { expect } from 'chai'

import { cleanUpDatabase, generateUser } from '../utils/db'
import { buildRequest, generateToken } from '../utils/helpers'

describe('Middleware route not found', () => {
  let user: User
  let token: string

  beforeEach(async () => {
    await cleanUpDatabase()
    user = await generateUser()
    token = generateToken({
      id: user.id
    })
  })

  afterEach(() => {
    user = null
    token = null
  })

  it('should return error if route not found', async () => {
    const resp = await buildRequest('get', `${process.env.BASE_PATH}/invalid/route`, token)

    expect(resp.status).to.be.eq(404)
    expect(resp.body.message).to.be.eq('Not found')
  })
})

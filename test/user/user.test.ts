import { expect } from 'chai'

import { User } from '../../src/types/models/user.interface'
import { cleanUpDatabase, generateUser } from '../utils/db'
import { buildRequest, generateToken } from '../utils/helpers'

describe('Users api', () => {
  let user: User
  let token: string

  beforeEach(async() => {
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

  it('Get user by id', async() => {
    const resp = await buildRequest('get', `${process.env.BASE_PATH}/users/${user.id}`, token)

    expect(resp.status).to.be.eq(200)
    expect(resp.body.email).to.be.eq(user.email)
  })
})

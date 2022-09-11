import { User } from '@src/types/models'
import { expect } from 'chai'

import { cleanUpDatabase, generateUser } from '../utils/db'
import { buildRequest, generateToken } from '../utils/helpers'

describe('GET /users', () => {
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

  it('should return users list', async () => {
    const users = await Promise.all([generateUser(), generateUser(), generateUser()])
    const resp = await buildRequest('get', `${process.env.BASE_PATH}/users`, token)

    users.push(user)

    const usersList = users.map((u: User) => JSON.parse(JSON.stringify(u.toJSON())))

    expect(resp.status).to.be.eq(200)
    expect(resp.body).to.deep.equalInAnyOrder(usersList)
  })

  it('should return user by id', async () => {
    const resp = await buildRequest('get', `${process.env.BASE_PATH}/users/${user.id}`, token)

    expect(resp.status).to.be.eq(200)
    expect(resp.body).to.deep.equalInAnyOrder(JSON.parse(JSON.stringify(user.toJSON())))
  })

  it('should return error if user not found', async () => {
    const resp = await buildRequest('get', `${process.env.BASE_PATH}/users/123`, token)

    expect(resp.status).to.be.eq(404)
    expect(resp.body.message).to.be.eq('User not found')
  })
})

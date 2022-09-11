import { User } from '@src/types/models'
import { expect } from 'chai'

import { cleanUpDatabase, generateUser } from '../utils/db'
import { buildRequest, generateToken } from '../utils/helpers'

describe('DELETE /users/:id', () => {
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

  it('should delete user by id', async () => {
    const resp = await buildRequest('delete', `${process.env.BASE_PATH}/users/${user.id}`, token)

    expect(resp.status).to.be.eq(200)
    expect(resp.body).to.deep.equalInAnyOrder(JSON.parse(JSON.stringify(user.toJSON())))
  })

  it('should return error if user not found', async () => {
    const resp = await buildRequest('delete', `${process.env.BASE_PATH}/users/123`, token)

    expect(resp.status).to.be.eq(404)
    expect(resp.body.message).to.be.eq('User not found')
  })
})

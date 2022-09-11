import { expect } from 'chai'

import { cleanUpDatabase } from './utils/db'
import { buildRequest } from './utils/helpers'

describe('GET /health', () => {
  beforeEach(async () => {
    await cleanUpDatabase()
  })

  it('should return health status', async () => {
    const resp = await buildRequest('get', `/health`)

    expect(resp.status).to.be.eq(200)
    expect(resp.body).to.containSubset({
      status: 'healthy',
      env: 'test'
    })
  })
})

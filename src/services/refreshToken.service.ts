import { FindOptions } from 'sequelize'

import { db } from '../models'
import { RefreshToken, RefreshTokenAttributes } from '../types/models'

class UserService {
  public async findOneRefreshToken(condition: FindOptions<RefreshTokenAttributes> = {}): Promise<RefreshToken> {
    return db.RefreshToken.findOne(condition)
  }
}

export default new UserService()

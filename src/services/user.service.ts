import { FindOptions } from 'sequelize'

import { db } from '../models'
import { User, UserAttributes, UserAuthenticateAttributes, UserCreationAttributes } from '../types/models'

class UserService {
  public async createUser(data: UserCreationAttributes): Promise<User> {
    return db.User.create(data)
  }

  public async authenticateUser(email: string, password: string): Promise<UserAuthenticateAttributes> {
    return db.User.authenticate(email, password)
  }

  public async findOneUser(condition: FindOptions<UserAttributes> = {}): Promise<User> {
    return db.User.findOne(condition)
  }

  public async findUserById(id: string | number): Promise<User> {
    return db.User.findByPk(id)
  }

  public async findUsers(condition: FindOptions<UserAttributes> = {}): Promise<User[]> {
    return db.User.findAll(condition)
  }
}

export default new UserService()

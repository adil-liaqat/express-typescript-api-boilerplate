import boom from '@hapi/boom'
import i18next from 'i18next'

import { db } from '../models'
import { IRequest, IResponse } from '../types/express'
import { User, UserPublicAttributes } from '../types/models'
export default class UserController {
  public async getUsers(_req: IRequest, _res: IResponse): Promise<UserPublicAttributes[]> {
    const users: User[] = await db.User.findAll()
    return users
  }

  public async getUserById(req: IRequest, _res: IResponse): Promise<UserPublicAttributes> {
    const user: User = await db.User.findByPk(req.params.id)
    if (!user) {
      throw boom.notFound(i18next.t('USER_NOT_FOUND'))
    }

    return user
  }

  public async deleteUser(req: IRequest, _res: IResponse): Promise<UserPublicAttributes> {
    const user: User = await db.User.findByPk(req.params.id)
    if (!user) {
      throw boom.notFound(i18next.t('USER_NOT_FOUND'))
    }
    await user.destroy()

    return user
  }
}

export const userController = new UserController()

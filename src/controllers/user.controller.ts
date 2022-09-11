import boom from '@hapi/boom'
import { Request, Response } from 'express'
import i18next from 'i18next'

import { db } from '../models'
import { User, UserPublicAttributes } from '../types/models'
export default class UserController {
  public async getUsers(_req: Request, _res: Response): Promise<UserPublicAttributes[]> {
    const users: User[] = await db.User.findAll()
    return users
  }

  public async getUserById(req: Request, _res: Response): Promise<UserPublicAttributes> {
    const user: User = await db.User.findByPk(req.params.id)
    if (!user) {
      throw boom.notFound(i18next.t('USER_NOT_FOUND'))
    }

    return user
  }

  public async deleteUser(req: Request, _res: Response): Promise<UserPublicAttributes> {
    const user: User = await db.User.findByPk(req.params.id)
    if (!user) {
      throw boom.notFound(i18next.t('USER_NOT_FOUND'))
    }
    await user.destroy()

    return user
  }
}

export const userController = new UserController()

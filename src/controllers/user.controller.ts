import boom from '@hapi/boom'
import i18next from 'i18next'

import { db } from '../models'
import { IRequest, IResponse } from '../types/express'
import { User, UserPublicAttributes } from '../types/models'
export default class UserController {
  public async getUsers(req: IRequest, res: IResponse): Promise<any> {
    const users: UserPublicAttributes[] = (
      await db.User.findAll()
    ).map((u: User) => u.toJSON())
    res.json(users)
  }

  public async getUserById(req: IRequest, res: IResponse): Promise<any> {
    const user: User = await db.User.findByPk(req.params.id)
    if (!user) {
      throw boom.notFound(i18next.t('USER_NOT_FOUND'))
    }
    res.json(user.toJSON())
  }

  public async deleteUser(req: IRequest, res: IResponse): Promise<any> {
    const user: User = await db.User.findByPk(req.params.id)
    if (!user) {
      throw boom.notFound(i18next.t('USER_NOT_FOUND'))
    }
    await user.destroy()
    res.json(user.toJSON())
  }
}

export const userController = new UserController()

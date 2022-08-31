import httpErrors from 'http-errors'
import { User, UserPublicAttributes } from '../types/models'
import { db } from '../models'
import { IRequest, IResponse } from '../types/express'
export default class UserController {
  public async getUsers(req: IRequest, res: IResponse): Promise<any> {
    const users: UserPublicAttributes[] = (
      await db.User.findAll({ context: { i18n: req.i18n } })
    ).map((u: User) => u.toJSON())
    res.json(users)
  }

  public async getUserById(req: IRequest, res: IResponse): Promise<any> {
    const user: User = await db.User.findByPk(req.params.id, { context: { i18n: req.i18n } })
    if (!user) {
      throw new httpErrors.NotFound(req.i18n.t('USER_NOT_FOUND'))
    }
    res.json(user.toJSON())
  }

  public async deleteUser(req: IRequest, res: IResponse): Promise<any> {
    const user: User = await db.User.findByPk(req.params.id, { context: { i18n: req.i18n } })
    if (!user) {
      throw new httpErrors.NotFound(req.i18n.t('USER_NOT_FOUND'))
    }
    await user.destroy({ context: { i18n: req.i18n } })
    res.json(user.toJSON())
  }
}

export const userController = new UserController()

import * as httpErrors from 'http-errors';
import { User, UserPublicAttributes } from '../interfaces/models/user.interface';
import { db } from '../models';
import { IRequest, IResponse } from '../interfaces/express';

export default class UserController {
  public async getUsers(req: IRequest, res: IResponse): Promise<any> {
    const users: UserPublicAttributes[] = (await db.User.findAll()).map((u: User) => u.toJSON());
    res.json(users);
  }

  public async getUserById(req: IRequest, res: IResponse): Promise<any> {
    const user: User = await db.User.findByPk(req.params.id);
    if (!user) {
      throw new httpErrors.NotFound('User not found');
    }
    res.json(user.toJSON());
  }

  public async deleteUser(req: IRequest, res: IResponse): Promise<any> {
    const user: User = await db.User.findByPk(req.params.id);
    if (!user) {
      throw new httpErrors.NotFound('User not found');
    }
    await user.destroy();
    res.json(user.toJSON());
  }
}

export const userController = new UserController();

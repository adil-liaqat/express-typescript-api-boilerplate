import { Request, Response } from 'express';

export default class UserController {
  public async index(req: Request, res: Response): Promise<any> {
    res.json({ msg: 'Hello World!' });
  }

  public async msg(req: Request, res: Response): Promise<any> {
    res.json({ msg: 'Hello Message!' });
  }
}

export const userController = new UserController();

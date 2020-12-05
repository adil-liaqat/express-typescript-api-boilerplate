import { Application } from 'express';
import userRoute  from './user.route';


export default function (app: Application) {
  const rootPath: string = '/api/v1';
  app.use(rootPath + '/users', userRoute);
}

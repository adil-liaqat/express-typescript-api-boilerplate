'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize, Model, Dialect, Op } from 'sequelize';

// import paginate = require('./globals/pagination');

import options from '../config/database';
import {UserFactory} from './user.model';
import {RefreshTokenFactory} from './refreshToken.model';

// const basename: string = path.basename(__filename);

const sequelize: Sequelize = new Sequelize(options);

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
//     );
//   })
//   .forEach((file) => {
//     const model = sequelize.import(path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

global.Op = Op;

export const db = {
  sequelize,
  Sequelize,
  User: UserFactory(sequelize),
  RefreshToken: RefreshTokenFactory(sequelize),
};

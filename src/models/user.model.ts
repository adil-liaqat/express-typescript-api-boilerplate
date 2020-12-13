import {Sequelize, DataTypes} from 'sequelize';
import {compare, genSalt, hash} from 'bcrypt';
import * as httpErrors from 'http-errors';
import * as jwt from 'jsonwebtoken';

import {
  UserAttributes,
  UserPublicAttributes,
  UserAuthenticateAttributes,
  UserInterface,
  User,
} from '../interfaces/models/user.interface';
import { Payload } from '../interfaces/jwt/payload.interface';

export const UserFactory = (sequelize: Sequelize): UserInterface => {

  const UserModel: UserInterface = <UserInterface>sequelize.define<User>('user', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.VIRTUAL,
      get(this: User) {
        return `${this.first_name} ${this.last_name}`;
      },
      set() {
        throw new httpErrors.BadRequest('Do not try to set the `full_name` value!');
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }, {
    tableName: 'user',
  })

  UserModel.addHook('beforeCreate', async (user: User) => {
    if (user.password && user.previous('password') !== user.password) {
      try {
        const salt: string = await genSalt(10);
        const hashedPassword: string = await hash(user.password, salt);
        user.password = hashedPassword;
      } catch (error) {
        throw new httpErrors.InternalServerError('Unable to hash password');
      }
    }
  })


  UserModel.authenticate = async function(email: string, password: string): Promise<UserAuthenticateAttributes> {
    const user: User = await UserModel.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new httpErrors.Unauthorized('Email is incorrect.');
    }

    const verifyPassword: boolean = await compare(password, user.password);

    if (!verifyPassword) {
      throw new httpErrors.Unauthorized('Invalid password.');
    }

    return {
      token: user.generateAuthToken(),
      ...user.toJSON(),
    };
  }

  UserModel.prototype.toJSON = function(this: User): UserPublicAttributes {
    const values: UserAttributes = Object.assign({}, this.get());
    delete values.password;
    return <UserPublicAttributes>values;
  };

  UserModel.prototype.generateAuthToken = function(this: User): string {
    const token: string = jwt.sign(
      <Payload>{ id: this.id }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256', },
    ).toString();

    return token;
  }

  return UserModel;
}

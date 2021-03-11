import {Sequelize, DataTypes} from 'sequelize';
import {compare, genSalt, hash} from 'bcrypt';
import httpErrors from 'http-errors';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import {
  UserAttributes,
  UserPublicAttributes,
  UserAuthenticateAttributes,
  UserInterface,
  User,
} from '../interfaces/models/user.interface';
import { Payload } from '../interfaces/jwt/payload.interface';
import { Templates } from '../interfaces/templates';

import sendMail from '../config/mailer';
import {i18next} from '../config/i18n';

import { AesEncrypt, randomString } from '../helpers';

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
    confirmation_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmation_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_password_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'user',
  })

  UserModel.addHook('beforeCreate', async (user: User) => {
    if (user.email) {
      user.email = user.email.toLowerCase();
    }

    user.password = await user.hashPassword();

    user.confirmation_token = randomString();
    user.confirmation_expires_at = moment().add(1, 'day').toDate();
  })

  UserModel.addHook('afterCreate', async (user: User) => {
    sendMail({
      template: Templates.emailConfirmation,
      data: user.get(),
      subject: i18next.t('EMAIL_CONFIRMATION'),
      to: `${user.full_name} <${user.email}>`,
    })
  })

  UserModel.addHook('beforeUpdate', async (user: User) => {
    user.password = await user.hashPassword();
  })


  UserModel.authenticate = async function(email: string, password: string): Promise<UserAuthenticateAttributes> {
    const user: User = await UserModel.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new httpErrors.Unauthorized(i18next.t('INCORRECT_EMAIL'));
    }

    const verifyPassword: boolean = await compare(password, user.password);

    if (!verifyPassword) {
      throw new httpErrors.Unauthorized(i18next.t('INCORRECT_PASSWORD'));
    }

    return {
      token: user.generateAuthToken(),
      ...user.toJSON(),
    };
  }

  UserModel.prototype.toJSON = function(this: User): UserPublicAttributes {
    const values: UserAttributes = Object.assign({}, this.get());
    delete values.password;
    delete values.confirmation_token;
    delete values.confirmation_expires_at;
    delete values.reset_password_token;
    delete values.reset_password_expires_at;
    return <UserPublicAttributes>values;
  };

  UserModel.prototype.generateAuthToken = function(this: User): string {
    const token: string = jwt.sign(
      <Payload>{ id: this.id }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256', },
    ).toString();
    const encrypt: string = AesEncrypt(token);
    return encrypt;
  }

  UserModel.prototype.hashPassword = async function(this: User): Promise<string> {
    if (this.password && this.previous('password') !== this.password) {
      try {
        const salt: string = await genSalt(10);
        const hashedPassword: string = await hash(this.password, salt);
        return hashedPassword;
      } catch (error) {
        throw new httpErrors.InternalServerError(i18next.t('PASSWORD_HASH_ERROR'));
      }
    }

    return this.password;
  }

  return UserModel;
}

import { compare, genSalt, hash } from 'bcrypt'
import httpErrors from 'http-errors'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { CreateOptions, DataTypes, FindOptions, Sequelize } from 'sequelize'

import { ACCESS_TOKEN_EXPIRY, JWT_ALGORITHM, REFRESH_TOKEN_EXPIRY_IN_DAYS } from '../config/app'
import { i18next } from '../config/i18n'
import mailer from '../config/mailer'
import { AesEncrypt, randomString } from '../helpers'
import { Payload } from '../types/jwt/payload.interface'
import {
  User,
  UserAttributes,
  UserAuthenticateAttributes,
  UserInterface,
  UserPublicAttributes
} from '../types/models'
import { Templates } from '../types/templates'

export const UserFactory = (sequelize: Sequelize): UserInterface => {
  const UserModel: UserInterface = <UserInterface>sequelize.define<User>('user', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    full_name: {
      type: DataTypes.VIRTUAL,
      get(this: User) {
        return `${this.first_name} ${this.last_name}`
      },
      set() {
        throw new httpErrors.BadRequest('Do not try to set the `full_name` value!')
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    confirmation_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    confirmation_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reset_password_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user'
  })

  UserModel.addHook('beforeCreate', async(user: User, options: CreateOptions<UserAttributes>) => {
    if (user.email) {
      user.email = user.email.toLowerCase()
    }

    user.password = await user.hashPassword()

    user.confirmation_token = randomString()
    user.confirmation_expires_at = moment().add(1, 'day').toDate()
  })

  UserModel.addHook('afterCreate', async(user: User, options: CreateOptions<UserAttributes>) => {
    mailer.sendMail({
      template: Templates.emailConfirmation,
      data: user.get(),
      subject: options.context.i18n.t('EMAIL_CONFIRMATION'),
      to: `${user.full_name} <${user.email}>`,
      lang: options.context.i18n.language
    })
  })

  UserModel.addHook('beforeUpdate', async(user: User) => {
    user.password = await user.hashPassword()
  })

  UserModel.authenticate = async function(
    email: string,
    password: string,
    options?: FindOptions<UserAttributes>
  ): Promise<UserAuthenticateAttributes> {
    const user: User = await UserModel.findOne({
      where: {
        email
      },
      ...options && options
    })

    if (!user) {
      throw new httpErrors.Unauthorized(options.context.i18n.t('INCORRECT_EMAIL'))
    }

    const verifyPassword: boolean = await compare(password, user.password)

    if (!verifyPassword) {
      throw new httpErrors.Unauthorized(options.context.i18n.t('INCORRECT_PASSWORD'))
    }

    return {
      token: user.generateAuthToken(),
      refresh_token: await user.generateRefreshToken(),
      ...user.toJSON()
    }
  }

  UserModel.prototype.toJSON = function(this: User): UserPublicAttributes {
    const values: UserAttributes = Object.assign({}, this.get())
    delete values.password
    delete values.confirmation_token
    delete values.confirmation_expires_at
    delete values.reset_password_token
    delete values.reset_password_expires_at
    return <UserPublicAttributes>values
  }

  UserModel.prototype.generateAuthToken = function(this: User): string {
    const token: string = jwt.sign(
      <Payload>{ id: this.id },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY, algorithm: JWT_ALGORITHM }
    ).toString()
    const encrypt: string = AesEncrypt(token)
    return encrypt
  }

  UserModel.prototype.generateRefreshToken = async function(this: User): Promise<string> {
    const secret: string = randomString()
    await sequelize.models.refresh_token.create({
      user_id: this.id,
      token: secret,
      token_expires_at: moment().add(REFRESH_TOKEN_EXPIRY_IN_DAYS, 'days').toDate()
    })
    return secret
  }

  UserModel.prototype.hashPassword = async function(this: User): Promise<string> {
    if (this.password && this.previous('password') !== this.password) {
      try {
        const salt: string = await genSalt(10)
        const hashedPassword: string = await hash(this.password, salt)
        return hashedPassword
      } catch (error) {
        throw new httpErrors.InternalServerError(i18next.t('PASSWORD_HASH_ERROR'))
      }
    }

    return this.password
  }

  return UserModel
}

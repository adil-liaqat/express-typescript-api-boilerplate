import { Request } from 'express'
import passport from 'passport'
import { Strategy as JWTStrategy } from 'passport-jwt'
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local'

import { AesDecrypt } from '../helpers'
import UserService from '../services/user.service'
import { Payload } from '../types/jwt/payload.interface'
import { User, UserAuthenticateAttributes } from '../types/models'
import { JWT_ALGORITHM } from './app'

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email: string, password: string, done: (err: any, data?: any, opts?: IVerifyOptions) => void) => {
      try {
        const user: UserAuthenticateAttributes = await UserService.authenticateUser(email, password)
        done(null, user)
      } catch (error: any) {
        done(error, false, { message: error.message })
      }
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      algorithms: [JWT_ALGORITHM],
      jwtFromRequest: (req: Request) => {
        let token: string | null = req.headers.authorization || null

        if (token) {
          token = token.split(' ')[1]
          try {
            token = AesDecrypt(token)
          } catch {
            token = null
          }
        }

        return token
      },
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload: Payload, cb: (err: any, data?: User) => void) => {
      try {
        const user: User = await UserService.findUserById(payload.id)
        cb(null, user)
      } catch (error: any) {
        cb(error)
      }
    }
  )
)

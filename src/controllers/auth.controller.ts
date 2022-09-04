import boom from '@hapi/boom'
import i18next from 'i18next'
import { decode } from 'jsonwebtoken'
import moment from 'moment'
import passport from 'passport'

import { REFRESH_TOKEN_EXPIRY_IN_DAYS } from '../config/app'
import mailer from '../config/mailer'
import { AesDecrypt, randomString } from '../helpers'
import { db } from '../models'
import { UserBodyEmail, UserRegister, UserVerify } from '../types/controllers/auth.interface'
import { INextFunction, IRequest, IResponse } from '../types/express'
import { Payload } from '../types/jwt/payload.interface'
import { RefreshToken, User, UserAuthenticateAttributes } from '../types/models'
import { Templates } from '../types/templates'

export default class AuthController {
  public async login(req: IRequest, res: IResponse, next: INextFunction): Promise<any> {
    passport.authenticate('local', { session: false }, async(error: Error, user: UserAuthenticateAttributes) => {
      if (error) return next(error)
      const { refresh_token, ...rest } = user
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        expires: moment().add(REFRESH_TOKEN_EXPIRY_IN_DAYS, 'days').toDate(),
        path: 'api/v1/auth'
      })
      res.json(rest)
    })(req, res, next)
  }

  public async register(req: IRequest, res: IResponse): Promise<any> {
    const data: UserRegister = <UserRegister>req.body
    const user: User = await db.User.create(data)
    res.json(user.toJSON())
  }

  public async verify(req: IRequest, res: IResponse): Promise<any> {
    const { token }: UserVerify = <UserVerify><unknown>req.params
    const user: User = await db.User.findOne({
      where: {
        confirmation_token: token
      }
    })

    if (!user) {
      throw boom.badRequest(i18next.t('INVALID_TOKEN'))
    }

    if (user.verified) {
      throw boom.conflict(i18next.t('USER_ALREADY_VERIFIED'))
    }

    if (moment().isSameOrAfter(user.confirmation_expires_at)) {
      throw boom.resourceGone(i18next.t('CONFIRMATION_LINK_EXPIRED'))
    }

    user.confirmation_token = null
    user.confirmation_expires_at = null
    user.verified = true

    await user.save()

    res.json(user.toJSON())
  }

  public async forgotPassword(req: IRequest, res: IResponse): Promise<any> {
    const { email }: UserBodyEmail = <UserBodyEmail>req.body
    const user: User = await db.User.findOne({
      where: {
        email
      }
    })

    if (!user) {
      throw boom.notFound(i18next.t('USER_NOT_FOUND'))
    }

    user.reset_password_expires_at = moment().add(1, 'hour').toDate()
    user.reset_password_token = randomString()

    await user.save()

    mailer.sendMail({
      template: Templates.forgotPassword,
      data: user.get(),
      subject: i18next.t('FORGOT_PASSWORD'),
      to: `${user.full_name} <${user.email}>`
    })

    res.json({ message: i18next.t('EMAIL_SENT') })
  }

  public async resetPassword(req: IRequest, res: IResponse): Promise<any> {
    const { token }: UserVerify = <UserVerify><unknown>req.params
    const { password } = req.body

    const user: User = await db.User.findOne({
      where: {
        reset_password_token: token
      }
    })

    if (!user) {
      throw boom.badRequest(i18next.t('INVALID_TOKEN'))
    }

    if (moment().isSameOrAfter(user.reset_password_expires_at)) {
      throw boom.resourceGone(i18next.t('RESET_LINK_EXPIRED'))
    }

    user.reset_password_expires_at = null
    user.reset_password_token = null
    user.password = password

    await user.save()

    res.json({ message: i18next.t('PASSWORD_RESET_SUCCESSFULLY') })
  }

  public async refreshToken(req: IRequest, res: IResponse): Promise<any> {
    const accessToken: string = req.body.access_token
    const refreshToken: string = req.cookies.refresh_token

    const rt: RefreshToken = await db.RefreshToken.findOne({
      where: {
        token: refreshToken
      }
    })

    if (!rt || rt.is_used || moment().isSameOrAfter(rt.token_expires_at)) {
      throw boom.unauthorized(i18next.t('INVALID_REFRESH_TOKEN'))
    }

    const decodedToken = <Payload>decode(AesDecrypt(accessToken))

    if (rt.user_id !== decodedToken?.id) {
      throw boom.unauthorized(i18next.t('INVALID_REFRESH_TOKEN'))
    }

    const user: User = await db.User.findByPk(rt.user_id)

    const newAccessToken = user.generateAuthToken()
    const newRefreshToken = await user.generateRefreshToken()

    res.clearCookie('refresh_token', { path: 'api/v1/auth' })

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      expires: moment().add(REFRESH_TOKEN_EXPIRY_IN_DAYS, 'days').toDate(),
      path: 'api/v1/auth'
    })

    rt.is_used = true
    rt.revoked_at = new Date()
    rt.replaced_by_token = newRefreshToken

    await rt.save()

    res.json({ token: newAccessToken })
  }
}

export const authController = new AuthController()

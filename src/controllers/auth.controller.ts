import passport from 'passport'
import httpErrors from 'http-errors'
import moment from 'moment'
import { decode } from 'jsonwebtoken'

import { AesDecrypt, ENCRYPTION_KEY, randomString } from '../helpers'
import sendMail from '../config/mailer'
import { db } from '../models'
import { User, UserAuthenticateAttributes } from '../types/models/user.interface'
import { RefreshToken } from '../types/models/refreshToken.interface'

import { IRequest, IResponse, INextFunction } from '../types/express'
import { UserRegister, UserVerify, UserBodyEmail } from '../types/controllers/auth.interface'
import { Templates } from '../types/templates'

import { REFRESH_TOKEN_EXPIRY_IN_DAYS } from '../config/app'
import { Payload } from '../types/jwt/payload.interface'

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
    const user: User = await db.User.create(data, { context: { i18n: req.i18n } })
    res.json(user.toJSON())
  }

  public async verify(req: IRequest, res: IResponse): Promise<any> {
    const { token }: UserVerify = <UserVerify><unknown>req.params
    const user: User = await db.User.findOne({
      where: {
        confirmation_token: token
      },
      context: { i18n: req.i18n }
    })

    if (!user) {
      throw new httpErrors.BadRequest(req.i18n.t('INVALID_TOKEN'))
    }

    if (user.verified) {
      throw new httpErrors.Conflict(req.i18n.t('USER_ALREADY_VERIFIED'))
    }

    if (moment().isSameOrAfter(user.confirmation_expires_at)) {
      throw new httpErrors.Gone(req.i18n.t('CONFIRMATION_LINK_EXPIRED'))
    }

    user.confirmation_token = null
    user.confirmation_expires_at = null
    user.verified = true

    await user.save({ context: { i18n: req.i18n } })

    res.json(user.toJSON())
  }

  public async forgotPassword(req: IRequest, res: IResponse): Promise<any> {
    const { email }: UserBodyEmail = <UserBodyEmail>req.body
    const user: User = await db.User.findOne({
      where: {
        email
      },
      context: { i18n: req.i18n }
    })

    if (!user) {
      throw new httpErrors.NotFound(req.i18n.t('USER_NOT_FOUND'))
    }

    user.reset_password_expires_at = moment().add(1, 'hour').toDate()
    user.reset_password_token = randomString()

    await user.save({ context: { i18n: req.i18n } })

    sendMail({
      template: Templates.forgotPassword,
      data: user.get(),
      subject: req.i18n.t('FORGOT_PASSWORD'),
      lang: req.i18n.language,
      to: `${user.full_name} <${user.email}>`
    })

    res.json({ message: req.i18n.t('EMAIL_SENT') })
  }

  public async resetPassword(req: IRequest, res: IResponse): Promise<any> {
    const { token }: UserVerify = <UserVerify><unknown>req.params
    const { password } = req.body

    const user: User = await db.User.findOne({
      where: {
        reset_password_token: token
      },
      context: { i18n: req.i18n }
    })

    if (!user) {
      throw new httpErrors.BadRequest(req.i18n.t('INVALID_TOKEN'))
    }

    if (moment().isSameOrAfter(user.reset_password_expires_at)) {
      throw new httpErrors.Gone(req.i18n.t('RESET_LINK_EXPIRED'))
    }

    user.reset_password_expires_at = null
    user.reset_password_token = null
    user.password = password

    await user.save({ context: { i18n: req.i18n } })

    res.json({ message: req.i18n.t('PASSWORD_RESET_SUCCESSFULLY') })
  }

  public async refreshToken(req: IRequest, res: IResponse): Promise<any> {
    const accessToken: string = req.body.access_token
    const refreshToken: string = req.cookies.refresh_token

    const rt: RefreshToken = await db.RefreshToken.findOne({
      where: {
        token: refreshToken
      },
      context: { i18n: req.i18n }
    })

    if (!rt || rt.is_used || moment().isSameOrAfter(rt.token_expires_at)) {
      throw new httpErrors.Unauthorized(req.i18n.t('INVALID_REFRESH_TOKEN'))
    }

    const decodedToken = <Payload>decode(AesDecrypt(accessToken, ENCRYPTION_KEY))

    if (rt.user_id !== decodedToken?.id) {
      throw new httpErrors.Unauthorized(req.i18n.t('INVALID_REFRESH_TOKEN'))
    }

    const user: User = await db.User.findByPk(rt.user_id, { context: { i18n: req.i18n } })

    if (!user) {
      throw new httpErrors.BadRequest(req.i18n.t('INVALID_TOKEN'))
    }

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

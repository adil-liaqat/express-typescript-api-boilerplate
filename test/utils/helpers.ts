import { AesEncrypt } from '@src/helpers'
import { Payload } from '@src/types/jwt/payload.interface'
import { sign } from 'jsonwebtoken'
import moment from 'moment'

import { request } from './request'

export const generateToken = (data: Partial<Payload> = {}): string => {
  const iat: number = moment().unix()
  const exp: number = moment().add(1, 'hour').unix()

  const resp = { iat, exp, ...data }
  return AesEncrypt(sign(resp, process.env.JWT_SECRET))
}

type IMethods = 'get' | 'post' | 'put' | 'patch' | 'delete'
export const buildRequest = (method: IMethods, url: string, token?: string) =>
  request[method](url).set('Authorization', `Bearer ${token}`)

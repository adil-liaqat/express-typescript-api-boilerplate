import { Algorithm } from 'jsonwebtoken'

const supportedLngs = process.env.SUPPORTED_LANGUAGES?.trim()
  .split(',')
  .map((lng: string) => lng?.trim())
  .filter((lng: string) => lng)

export const REFRESH_TOKEN_EXPIRY_IN_DAYS: number = 7
export const ACCESS_TOKEN_EXPIRY: number | string = '1h'
export const JWT_ALGORITHM: Algorithm = 'HS256'
export const SUPPORTED_LANGUAGES = supportedLngs?.length ? supportedLngs : ['en', 'ar']

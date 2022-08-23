import { sync } from 'glob'
import { union } from 'lodash'
import { randomBytes, createCipheriv, Cipher, createDecipheriv, Decipher } from 'crypto'

import { INextFunction, IRequest, IResponse } from '../types/express'

export const ENCRYPTION_KEY: string = 'SOMERANDOMSTRINGSOMERANDOMSTRING' // Must be 256 bits (32 characters)

export const globFiles = (location: string): string[] => {
  return union([], sync(location))
}

/**
 * Handle async function
 *
 * @param {Function} fn
 * @return {Function}
 */
export const asyncHandler = (fn: (req: IRequest, res: IResponse, next: INextFunction) => Promise<any>) =>
  (req: IRequest, res: IResponse, next: INextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)

/**
 * Generate random string
 *
 * @param {number} length
 * @return {string}
 */
export const randomString = (length: number = 32): string => randomBytes(length).toString('hex')

/**
 * AES Encryption
 *
 * @param {any} data data to be encrypted
 * @param {string} secret phrase with which data should be encrypted. Must be 256 bits (32 characters)
 * @return {string}
 */
export const AesEncrypt = (data: any, secret?: string): string => {
  const iv: Buffer = randomBytes(16)
  const cipher: Cipher = createCipheriv('aes-256-cbc', Buffer.from(secret || ENCRYPTION_KEY), iv)

  let encrypted: Buffer = cipher.update(data)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString('hex') + '.' + encrypted.toString('hex')
}

/**
 * AES Decryption
 *
 * @param {any} data Encrypted data
 * @param {string} secret phrase with which data should be decrypted. Must be 256 bits (32 characters)
 * @return {string}
 */
export const AesDecrypt = (data: any, secret?: string): string => {
  const textParts: string[] = data.split('.')
  const iv: Buffer = Buffer.from(textParts.shift(), 'hex')
  const encryptedText: Buffer = Buffer.from(textParts.join(':'), 'hex')
  const decipher: Decipher = createDecipheriv('aes-256-cbc', Buffer.from(secret || ENCRYPTION_KEY), iv)
  let decrypted: Buffer = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

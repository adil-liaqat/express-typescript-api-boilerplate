import { Cipher, createCipheriv, createDecipheriv, Decipher, randomBytes } from 'crypto'
// import { sync } from 'glob'
// import { union } from 'lodash'
import { NextFunction, Request, Response } from 'express'

const ENCRYPTION_KEY: string = process.env.AES_ENCRYPTION_KEY // Must be 256 bits (32 characters)

// export const globFiles = (location: string): string[] => {
//   return union([], sync(location))
// }

/**
 * Handle async function
 *
 * @param {Function} fn
 * @return {Function}
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next))
      .then((data: any) => {
        if (res.locals.isResponseHandled) return
        else if (data) return res.status(res.statusCode || 200).json(data)

        return res.status(204).send()
      })
      .catch(next)

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

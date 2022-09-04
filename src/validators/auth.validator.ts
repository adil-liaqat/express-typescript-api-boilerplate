import { SchemaOptions, Segments } from 'celebrate'
import joi from 'joi'

import { confirmFieldValidation, emailValidation, stringValidation } from './common.validator'

/**
 * Register Joi Schema
 */
export const registerSchema: SchemaOptions = {
  [Segments.BODY]: joi.object({
    first_name: stringValidation('first_name'),

    last_name: stringValidation('last_name'),

    email: emailValidation('email'),

    password: stringValidation('password'),

    confirm_password: confirmFieldValidation('confirm_password', 'password')
  }).with('password', 'confirm_password')
}

/**
 * Login Joi Schema
 */
export const loginSchema: SchemaOptions = {
  [Segments.BODY]: joi.object({
    email: emailValidation('email'),
    password: stringValidation('password')
  })
}

/**
 * Reset Password Joi Schema
 */
export const resetPasswordSchema: SchemaOptions = {
  [Segments.BODY]: joi.object({
    password: stringValidation('password'),
    confirm_password: confirmFieldValidation('confirm_password', 'password')
  }).with('password', 'confirm_password'),

  [Segments.PARAMS]: joi.object({
    token: stringValidation('token')
  })
}

/**
 * Refresh Token Joi Schema
 */
export const refreshTokenSchema: SchemaOptions = {
  [Segments.BODY]: joi.object({
    access_token: stringValidation('access_token')
  }),
  [Segments.COOKIES]: {
    refresh_token: stringValidation('refresh_token')
  }
}

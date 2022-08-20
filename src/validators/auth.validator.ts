import joi from 'joi';
import { i18n } from 'i18next';
import { Segments } from 'celebrate';

import { stringValidation, emailValidation, confirmFieldValidation } from './common.validator';

/**
 * Register Joi Schema
 */
export const registerSchema = (_i18n: i18n): joi.Schema => <joi.Schema><unknown>{
  [Segments.BODY]: joi.object({
    first_name: stringValidation('first_name')(_i18n),

    last_name: stringValidation('last_name')(_i18n),

    email: emailValidation('email')(_i18n),

    password: stringValidation('password')(_i18n),

    confirm_password: confirmFieldValidation('confirm_password', 'password')(_i18n)
  }).with('password', 'confirm_password')
};

/**
 * Login Joi Schema
 */
export const loginSchema = (_i18n: i18n): joi.Schema => <joi.Schema><unknown>{
  [Segments.BODY]: joi.object({
    email: emailValidation('email')(_i18n),
    password: stringValidation('password')(_i18n)
  })
};

/**
 * Reset Password Joi Schema
 */
export const resetPasswordSchema = (_i18n: i18n): joi.Schema => <joi.Schema><unknown>{
  [Segments.BODY]: joi.object({
    password: stringValidation('password')(_i18n),
    confirm_password: confirmFieldValidation('confirm_password', 'password')(_i18n)
  }).with('password', 'confirm_password'),

  [Segments.PARAMS]: joi.object({
    token: stringValidation('token')(_i18n)
  })
};

/**
 * Refresh Token Joi Schema
 */
export const refreshTokenSchema = (_i18n: i18n): joi.Schema => <joi.Schema><unknown>{
  [Segments.BODY]: joi.object({
    access_token: stringValidation('access_token')(_i18n)
  }),
  [Segments.COOKIES]: {
    refresh_token: stringValidation('refresh_token')(_i18n)
  }
};

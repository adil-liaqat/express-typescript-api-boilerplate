import joi from 'joi';
import { stringValidation, emailValidation, confirmFieldValidation } from './common.validator';
import { i18n } from 'i18next';
/**
 * Register Joi Schema
 */
export const registerSchema = (i18n: i18n): joi.Schema => joi.object({
  first_name: stringValidation('first_name')(i18n),

  last_name: stringValidation('last_name')(i18n),

  email: emailValidation('email')(i18n),

  password: stringValidation('password')(i18n),

  confirm_password: confirmFieldValidation('confirm_password', 'password')(i18n),
}).with('password', 'confirm_password');

/**
 * Login Joi Schema
 */
export const loginSchema = (i18n: i18n): joi.Schema => joi.object({
  email: emailValidation('email')(i18n),

  password: stringValidation('password')(i18n),
});

/**
 * Reset Password Joi Schema
 */
export const resetPasswordSchema = (i18n: i18n): joi.Schema => joi.object({
  body: {
    password: stringValidation('password')(i18n),

    confirm_password: confirmFieldValidation('confirm_password', 'password')(i18n),
  },
  params: {
    token: stringValidation('token')(i18n),
  },
}).with('password', 'confirm_password');


/**
 * Refresh Token Joi Schema
 */
export const refreshTokenSchema = (i18n: i18n): joi.Schema => joi.object({
  body: {
    access_token: stringValidation('access_token')(i18n),
  },
  cookies: {
    refresh_token: stringValidation('refresh_token')(i18n)
  }
});

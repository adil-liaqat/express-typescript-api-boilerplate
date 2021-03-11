import joi from 'joi';
import { stringValidation, emailValidation, confirmFieldValidation } from './common.validator';

/**
 * Register Joi Schema
 */
export const registerSchema = (): joi.Schema => joi.object({
  first_name: stringValidation('first_name'),

  last_name: stringValidation('last_name'),

  email: emailValidation('email'),

  password: stringValidation('password'),

  confirm_password: confirmFieldValidation('confirm_password', 'password'),
}).with('password', 'confirm_password');

/**
 * Login Joi Schema
 */
export const loginSchema = (): joi.Schema => joi.object({
  email: emailValidation('email'),

  password: stringValidation('password'),
});

/**
 * Reset Password Joi Schema
 */
export const resetPasswordSchema = (): joi.Schema => joi.object({
  body: {
    password: stringValidation('password'),

    confirm_password: confirmFieldValidation('confirm_password', 'password'),
  },
  params: {
    token: stringValidation('token'),
  },
}).with('password', 'confirm_password');

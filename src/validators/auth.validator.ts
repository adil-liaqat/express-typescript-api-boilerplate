import * as joi from 'joi';

export const registerSchema: joi.Schema = joi.object({
  first_name: joi.string()
    .required()
    .error(new Error('first_name is required.')),

  last_name: joi.string()
    .required()
    .error(new Error('last_name is required.')),

  email: joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'email should be valid.',
      'string.empty': `email cannot be an empty.`,
      'any.required': 'email is required.',
    }),

  password: joi.string()
    .required()
    .messages({
      'string.empty': `password cannot be an empty.`,
      'any.required': 'password is required.',
    }),

  confirm_password: joi.valid(joi.ref('password')).required().messages({
    'any.only': 'confirm_password must match with password.',
    'any.required': 'confirm_password is required.',
  }),
}).with('password', 'confirm_password');


export const loginSchema: joi.Schema = joi.object({
  email: joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'email should be valid.',
      'string.empty': 'email cannot be an empty.',
      'any.required': 'email is required.',
    }),

  password: joi.string()
    .required()
    .messages({
      'string.empty': `password cannot be an empty.`,
      'any.required': 'password is required.',
    }),
});



import joi from 'joi'

/**
 * Required string field validation
 *
 * @param field Name of the field
 */
export const stringValidation = (field: string): joi.StringSchema => joi.string().required()

/**
 * Required email field validation
 *
 * @param field Name of the field
 */
export const emailValidation = (field: string): joi.StringSchema => joi.string().email().required()

/**
 * Required confirm password field validation
 *
 * @param field Name of the field
 * @param compareWith Field with which to compare
 */
export const confirmFieldValidation = (field: string, compareWith: string): joi.Schema =>
  joi.string().required().valid(joi.ref(compareWith))

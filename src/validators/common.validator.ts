import joi from 'joi'
import { i18n } from 'i18next'

/**
 * Required string field validation
 *
 * @param field Name of the field
 */
export const stringValidation = (field: string) => (i18next: i18n): joi.StringSchema =>
  joi.string()
    .required()
    .messages({
      'string.empty': i18next.t('CANNOT_BE_EMPTY', { field }),
      'any.required': i18next.t('IS_REQUIRED', { field })
    })

/**
 * Required email field validation
 *
 * @param field Name of the field
 */
export const emailValidation = (field: string) => (i18next: i18n): joi.StringSchema =>
  joi.string()
    .email()
    .required()
    .messages({
      'string.email': i18next.t('SHOULD_BE_VALID', { field }),
      'string.empty': i18next.t('CANNOT_BE_EMPTY', { field }),
      'any.required': i18next.t('IS_REQUIRED', { field })
    })

/**
 * Required confirm password field validation
 *
 * @param field Name of the field
 * @param compareWith Field with which to compare
 */
export const confirmFieldValidation = (field: string, compareWith: string) => (i18next: i18n): joi.Schema =>
  joi
    .valid(joi.ref(compareWith))
    .required()
    .messages({
      'any.only': i18next.t('MUST_MATCH_WITH', { match: field, with: compareWith }),
      'any.required': i18next.t('IS_REQUIRED', { field })
    })

import { Router } from 'express'

import { authController } from '../controllers/auth.controller'
import { asyncHandler } from '../helpers'
import validatorMiddleware from '../middlewares/validator.middleware'
import { loginSchema, refreshTokenSchema, registerSchema, resetPasswordSchema } from '../validators/auth.validator'

const router: Router = Router()

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User register and login
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Login to the application
 *     security: []
 *     tags:
 *        - Authentication
 *     requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                properties:
 *                  email:
 *                    type: string
 *                    description: Email of user
 *                  password:
 *                    type: string
 *                    description: Password of user
 *     responses:
 *       200:
 *         description: login
 *         headers:
 *           Set-Cookie:
 *             description: Contains the cookie named `refresh_token`.
 *         content:
 *           application/json:
 *             schema:
 *                allOf:
 *                    - $ref: '#/components/schemas/User'
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *       Error:
 *          $ref: '#/components/responses/GenericError'
 */

router.post(
  '/login',
  validatorMiddleware(loginSchema),
  asyncHandler(authController.login)
)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     description: Register user to the application
 *     security: []
 *     tags:
 *        - Authentication
 *     requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                properties:
 *                  first_name:
 *                    type: string
 *                    description: First name of user
 *                  last_name:
 *                    type: string
 *                    description: Last name of user
 *                  email:
 *                    type: string
 *                    description: Email of user
 *                  password:
 *                    type: string
 *                    description: Password of user
 *                  confirm_password:
 *                    type: string
 *                    description: Type same password again
 *     responses:
 *       200:
 *         description: Register api response
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       Error:
 *          $ref: '#/components/responses/GenericError'
 */
router.post(
  '/register',
  validatorMiddleware(registerSchema),
  asyncHandler(authController.register)
)

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     description: Verify user email address
 *     parameters:
 *     - in: path
 *       name: token
 *       schema:
 *         type: string
 *       required: true
 *     security: []
 *     tags:
 *        - Authentication
 *     responses:
 *       200:
 *         description: Email address verified
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       Error:
 *          $ref: '#/components/responses/GenericError'
 */
router.get(
  '/verify/:token',
  asyncHandler(authController.verify)
)

/**
 * @swagger
 * /auth/forgot/password:
 *   post:
 *     description: Send email to registered user to reset password
 *     security: []
 *     tags:
 *        - Authentication
 *     requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                properties:
 *                  email:
 *                    type: string
 *                    description: Email of user
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Email of user
 *       Error:
 *          $ref: '#/components/responses/GenericError'
 */
router.post(
  '/forgot/password',
  asyncHandler(authController.forgotPassword)
)

/**
 * @swagger
 * /auth/reset/password/{token}:
 *   post:
 *     description: Send email to registered user to reset password
 *     parameters:
 *     - in: path
 *       name: token
 *       schema:
 *         type: string
 *       required: true
 *     security: []
 *     tags:
 *        - Authentication
 *     requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                properties:
 *                  password:
 *                    type: string
 *                    description: New password
 *                  confirm_password:
 *                    type: string
 *                    description: Confirm new password
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Email of user
 *       Error:
 *          $ref: '#/components/responses/GenericError'
 */
router.post(
  '/reset/password/:token',
  validatorMiddleware(resetPasswordSchema),
  asyncHandler(authController.resetPassword)
)

/**
 * @swagger
 * /auth/token/refresh:
 *   post:
 *     description: Get new access token
 *     security: []
 *     tags:
 *        - Authentication
 *     requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                properties:
 *                  access_token:
 *                    type: string
 *                    description: Old access token
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *                properties:
 *                  token:
 *                    type: string
 *                    description: Access token
 *       Error:
 *          $ref: '#/components/responses/GenericError'
 */
router.post(
  '/token/refresh',
  validatorMiddleware(refreshTokenSchema),
  asyncHandler(authController.refreshToken)
)
export default router

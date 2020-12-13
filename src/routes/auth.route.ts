import { Router } from 'express';
import { asyncHandler } from '../helpers';
import { authController } from '../controllers/auth.controller';
import validatorMiddleware from '../middlewares/validator.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router: Router = Router();

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
  asyncHandler(authController.login),
);



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
  asyncHandler(authController.register),
);

export default router;

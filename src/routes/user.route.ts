import { Router } from 'express'
import { asyncHandler } from '../helpers'
import { userController } from '../controllers/user.controller'

const router: Router = Router()

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User endpoints
 */

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *         id:
 *           type: integer
 *           format: int64
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         full_name:
 *           type: string
 *         email:
 *           type: string
 *         verified:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get all users
 *     tags:
 *      - User
 *     responses:
 *       200:
 *         description: Api response
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *       401:
 *          $ref: '#/components/responses/GenericError'
 *       Error:
 *          $ref: '#/components/responses/GenericError'
 */

router.get('/', asyncHandler(userController.getUsers))

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     description: Get all users
 *     parameters:
 *     - $ref: '#/components/parameters/id'
 *     tags:
 *      - User
 *     responses:
 *       200:
 *         description: Api response
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       401:
 *          $ref: '#/components/responses/GenericError'
 *       Error:
 *          $ref: '#/components/responses/GenericError'
 */

router.get('/:id(\\d+)/', asyncHandler(userController.getUserById))

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     description: Get all users
 *     parameters:
 *     - $ref: '#/components/parameters/id'
 *     tags:
 *      - User
 *     responses:
 *       200:
 *         description: Api response
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       401:
 *          $ref: '#/components/responses/GenericError'
 *       Error:
 *          $ref: '#/components/responses/GenericError'
 */

router.delete('/:id(\\d+)/', asyncHandler(userController.deleteUser))

export default router

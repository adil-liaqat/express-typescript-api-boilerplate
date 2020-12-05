import { Router } from 'express';
import { asyncHandler } from '../helpers';
import { userController } from '../controllers/user.controller';

const router: Router = Router();

router.get('/', asyncHandler(userController.index));

router.get('/msg', asyncHandler(userController.msg));

export default router;

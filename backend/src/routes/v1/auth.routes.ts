import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { validateBody } from '../../middlewares/validate';
import { loginSchema, registerSchema } from '../../schemas/auth.schema';
import { checkAuth } from '../../middlewares/checkAuth';

const authRoutes = Router();

authRoutes.get('/me', checkAuth(), authController.me); // TODO(auth): implement getMe route in authController

authRoutes.post(
  '/register',
  validateBody(registerSchema),
  authController.register
);

authRoutes.post('/login', validateBody(loginSchema), authController.login);

authRoutes.post('/logout', authController.logout);

export default authRoutes;

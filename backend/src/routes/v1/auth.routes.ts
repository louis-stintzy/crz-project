import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { validateBody } from '../../middlewares/validate';
import { registerSchema } from '../../schemas/auth.schema';

const authRoutes = Router();

authRoutes.post(
  '/register',
  validateBody(registerSchema),
  authController.register
);

authRoutes.post('/login', authController.login);

authRoutes.post('/logout', authController.logout);

export default authRoutes;

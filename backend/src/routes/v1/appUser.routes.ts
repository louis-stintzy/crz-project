import { Router } from 'express';
import { validateBody, validateParams } from '../../middlewares/validate';
import { appUserController } from '../../controllers/appUser.controller';
import {
  appUserIdParamSchema,
  updateAppUserSchema,
} from '../../schemas/appUser.schema';

const appUserRoutes = Router();

// TODO(auth): split public and protected user routes.
// Public routes should eventually move to /auth, e.g. POST /auth/register and POST /auth/login.
// Sensitive routes such as GET /users, PATCH /users/:id, and DELETE /users/:id
// must require authentication and authorization before production deployment.

appUserRoutes.get('/', appUserController.getAll);

appUserRoutes.get(
  '/:id',
  validateParams(appUserIdParamSchema),
  appUserController.getById
);

appUserRoutes.patch(
  '/:id',
  validateParams(appUserIdParamSchema),
  validateBody(updateAppUserSchema),
  appUserController.updateById
);

appUserRoutes.delete(
  '/:id',
  validateParams(appUserIdParamSchema),
  appUserController.deleteById
);

export default appUserRoutes;

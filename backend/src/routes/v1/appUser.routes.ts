import { Router } from 'express';
import { validateBody, validateParams } from '../../middlewares/validate';
import { appUserController } from '../../controllers/appUser.controller';
import {
  appUserIdParamSchema,
  updateAppUserSchema,
} from '../../schemas/appUser.schema';
import { checkAuth } from '../../middlewares/checkAuth';

// Note: Apply authentication middleware to all routes in this router
const appUserRoutes = Router();
appUserRoutes.use(checkAuth());

// ----- Routes "self" -----
appUserRoutes.get('/me', appUserController.getMe);
appUserRoutes.patch(
  '/me',
  validateBody(updateAppUserSchema),
  appUserController.updateMe
);
appUserRoutes.delete('/me', appUserController.deleteMe);

// ----- Routes "admin" -----
// TODO(auth): add authorization middleware to restrict access to admin users only.
// ! WARNING: authenticated-only is not enough for these routes.
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

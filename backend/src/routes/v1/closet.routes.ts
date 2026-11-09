import { Router } from 'express';
import { closetController } from '../../controllers/closet.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateBody, validateParams } from '../../middlewares/validate';
import {
  closetIdParamSchema,
  createClosetSchema,
  updateClosetSchema,
} from '../../schemas/closet.schema';

const closetRoutes = Router();
closetRoutes.use(checkAuth());

closetRoutes.get('/', closetController.getAll);

closetRoutes.get(
  '/:id',
  validateParams(closetIdParamSchema),
  closetController.getById
);

closetRoutes.post(
  '/',
  validateBody(createClosetSchema),
  closetController.create
);

closetRoutes.patch(
  '/:id',
  validateParams(closetIdParamSchema),
  validateBody(updateClosetSchema),
  closetController.updateById
);

closetRoutes.delete(
  '/:id',
  validateParams(closetIdParamSchema),
  closetController.deleteById
);

export default closetRoutes;

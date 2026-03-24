import { Router } from 'express';
import { clothesController } from '../../controllers/clothes.controller';
import {
  clothingIdParamSchema,
  createClothingItemSchema,
} from '../../schemas/clothes.schema';
import { validateBody, validateParams } from '../../middlewares/validate';

const clothesRoutes = Router();

clothesRoutes.get('/', clothesController.getAll);

clothesRoutes.get(
  '/:id',
  validateParams(clothingIdParamSchema),
  clothesController.getById
);

clothesRoutes.post(
  '/',
  validateBody(createClothingItemSchema),
  clothesController.create
);

clothesRoutes.put(
  '/:id',
  validateParams(clothingIdParamSchema),
  clothesController.updateById
);

clothesRoutes.delete(
  '/:id',
  validateParams(clothingIdParamSchema),
  clothesController.deleteById
);

export default clothesRoutes;

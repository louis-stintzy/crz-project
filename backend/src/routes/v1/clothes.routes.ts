import { Router } from 'express';
import { clothesController } from '../../controllers/clothes.controller';
import { createClothingItemSchema } from '../../schemas/clothes.schema';
import { validateBody } from '../../middlewares/validate';

const clothesRoutes = Router();

clothesRoutes.get('/', clothesController.getAll);
clothesRoutes.get('/:id', clothesController.getById);
clothesRoutes.post(
  '/',
  validateBody(createClothingItemSchema),
  clothesController.create
);
clothesRoutes.put('/:id', clothesController.updateById);
clothesRoutes.delete('/:id', clothesController.deleteById);

export default clothesRoutes;

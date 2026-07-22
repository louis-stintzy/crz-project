import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
// Note: Apply authentication middleware to all routes in this router

const closetRoutes = Router();
closetRoutes.use(checkAuth());

closetRoutes.get('/', (_req, res) => {
  console.log('[GET] /api/v1/closets');
  res.send('Get all closets');
});

closetRoutes.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`[GET] /api/v1/closets/${id}`);
  res.send(`Get closet by ID: ${id}`);
});

closetRoutes.post('/', (_req, res) => {
  console.log('[POST] /api/v1/closets');
  res.send('Create a new clothing item');
});

closetRoutes.patch('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`[PUT] /api/v1/closets/${id}`);
  res.send(`Update closet with ID: ${id}`);
});

closetRoutes.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE] /api/v1/closets/${id}`);
  res.send(`Delete closet with ID: ${id}`);
});

export default closetRoutes;

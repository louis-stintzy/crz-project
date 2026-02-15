import { Router } from 'express';

const clothesRoutes = Router();

clothesRoutes.get('/', (_req, res) => {
  console.log('[GET] /api/v1/clothes');
  res.send('Get all clothes');
});

clothesRoutes.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`[GET] /api/v1/clothes/${id}`);
  res.send(`Get clothing item by ID: ${id}`);
});

clothesRoutes.post('/', (_req, res) => {
  console.log('[POST] /api/v1/clothes');
  res.send('Create a new clothing item');
});

clothesRoutes.put('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`[PUT] /api/v1/clothes/${id}`);
  res.send(`Update clothing item with ID: ${id}`);
});

clothesRoutes.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE] /api/v1/clothes/${id}`);
  res.send(`Delete clothing item with ID: ${id}`);
});

export default clothesRoutes;

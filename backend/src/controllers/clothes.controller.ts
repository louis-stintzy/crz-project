import { RequestHandler } from 'express';

const getAll: RequestHandler = (_req, res) => {
  console.log('[GET] /api/v1/clothes');
  res.send('Get all clothes');
};

const getById: RequestHandler = (req, res) => {
  const { id } = req.params;
  console.log(`[GET] /api/v1/clothes/${id}`);
  res.send(`Get clothing item by ID: ${id}`);
};

const create: RequestHandler = (_req, res) => {
  console.log('[POST] /api/v1/clothes');
  res.send('Create a new clothing item');
};

const updateById: RequestHandler = (req, res) => {
  const { id } = req.params;
  console.log(`[PUT] /api/v1/clothes/${id}`);
  res.send(`Update clothing item with ID: ${id}`);
};

const deleteById: RequestHandler = (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE] /api/v1/clothes/${id}`);
  res.send(`Delete clothing item with ID: ${id}`);
};

export const clothesController = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

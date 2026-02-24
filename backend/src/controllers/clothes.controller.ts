import { RequestHandler } from 'express';
import { ClothingItem, CreateClothingItemDTO } from '../types/closet.types';
import { clothesService } from '../services/clothes.service';

const getAll: RequestHandler<
  unknown,
  ClothingItem[],
  unknown,
  unknown
> = async (_req, res, next) => {
  try {
    console.log('[GET] /api/v1/clothes');
    const items = await clothesService.getAll();
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

const getById: RequestHandler<
  { id: string },
  ClothingItem | { message: string },
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    // TODO: Validate ID format (middleware)
    const { id } = req.params;
    console.log(`[GET] /api/v1/clothes/${id}`);
    const item = await clothesService.getById(id);
    // TODO: Handle case where item is not found (service layer)
    if (item === null)
      res.status(404).json({ message: 'Clothing item not found' });
    else res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

const create: RequestHandler<
  unknown,
  ClothingItem,
  CreateClothingItemDTO,
  unknown
> = async (req, res, next) => {
  try {
    console.log('[POST] /api/v1/clothes');
    const newItem: CreateClothingItemDTO = req.body;
    const createdItem: ClothingItem = await clothesService.create(newItem);
    res.status(201).json(createdItem);
  } catch (error) {
    next(error);
  }
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

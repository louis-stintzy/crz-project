import { RequestHandler } from 'express';
import { closetService } from '../services/closet.service';
import {
  Closet,
  ClosetIdParams,
  CreateClosetDTO,
  UpdateClosetDTO,
} from '../types/closet.types';

const getAll: RequestHandler<unknown, Closet[], unknown, unknown> = async (
  req,
  res
) => {
  console.log('[GET] /api/v1/closets');
  const closets = await closetService.getAll(req.user!.userId);
  res.status(200).json(closets);
};

const getById: RequestHandler<
  ClosetIdParams,
  Closet,
  unknown,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  console.log(`[GET] /api/v1/closets/${id}`);
  const closet = await closetService.getById(id, req.user!.userId);
  res.status(200).json(closet);
};

const create: RequestHandler<
  unknown,
  Closet,
  CreateClosetDTO,
  unknown
> = async (req, res) => {
  console.log('[POST] /api/v1/closets');
  const closet = await closetService.create(req.user!.userId, req.body);
  res.status(201).json(closet);
};

const updateById: RequestHandler<
  ClosetIdParams,
  Closet,
  UpdateClosetDTO,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  console.log(`[PATCH] /api/v1/closets/${id}`);
  const closet = await closetService.updateById(id, req.user!.userId, req.body);
  res.status(200).json(closet);
};

const deleteById: RequestHandler<
  ClosetIdParams,
  void,
  unknown,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE] /api/v1/closets/${id}`);
  await closetService.deleteById(id, req.user!.userId);
  res.status(204).end();
};

export const closetController = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

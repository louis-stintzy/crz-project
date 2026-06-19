import { RequestHandler } from 'express';
import {
  AppUserIdParams,
  AppUserPublic,
  CreateAppUserDTO,
  UpdateAppUserDTO,
} from '../types/appUser.types';
import { appUserService } from '../services/appUser.service';

const getAll: RequestHandler<
  unknown,
  AppUserPublic[],
  unknown,
  unknown
> = async (_req, res) => {
  console.log('[GET] /api/v1/users');
  const users = await appUserService.getAll();
  res.status(200).json(users);
};

const getById: RequestHandler<
  AppUserIdParams,
  AppUserPublic,
  unknown,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  console.log(`[GET] /api/v1/users/${id}`);
  const user = await appUserService.getById(id);
  res.status(200).json(user);
};

const create: RequestHandler<
  unknown,
  AppUserPublic,
  CreateAppUserDTO,
  unknown
> = async (req, res) => {
  console.log('[POST] /api/v1/users');
  const createdUser = await appUserService.create(req.body);
  res.status(201).json(createdUser);
};

const updateById: RequestHandler<
  AppUserIdParams,
  AppUserPublic,
  UpdateAppUserDTO,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  console.log(`[PATCH] /api/v1/users/${id}`);
  const updatedUser = await appUserService.updateById(id, req.body);
  res.status(200).json(updatedUser);
};

const deleteById: RequestHandler<
  AppUserIdParams,
  void,
  unknown,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE] /api/v1/users/${id}`);
  await appUserService.deleteById(id);
  res.status(204).end();
};

export const appUserController = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

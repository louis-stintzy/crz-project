import { RequestHandler } from 'express';
import {
  AppUserIdParams,
  AppUserPublic,
  UpdateAppUserDTO,
} from '../types/appUser.types';
import { appUserService } from '../services/appUser.service';
import { clearAccessTokenCookie } from '../utils/auth/cookie';

// ----- Routes "self" `/api/v1/users/me` -----

// Note : Assuming req.user is populated by the checkAuth middleware

const getMe: RequestHandler<unknown, AppUserPublic, unknown, unknown> = async (
  req,
  res
) => {
  console.log('[GET] /api/v1/users/me');
  const currentUser = await appUserService.getById(req.user!.userId);
  res.status(200).json(currentUser);
};

const updateMe: RequestHandler<
  unknown,
  AppUserPublic,
  UpdateAppUserDTO,
  unknown
> = async (req, res) => {
  console.log('[PATCH] /api/v1/users/me');
  const updatedUser = await appUserService.updateById(
    req.user!.userId,
    req.body
  );
  res.status(200).json(updatedUser);
};

const deleteMe: RequestHandler<unknown, void, unknown, unknown> = async (
  req,
  res
) => {
  console.log('[DELETE] /api/v1/users/me');
  await appUserService.deleteById(req.user!.userId);
  clearAccessTokenCookie(res); // Clear the access token cookie upon account deletion
  res.status(204).end();
};

// ----- Routes "admin" `/api/v1/users` &  `/api/v1/users/:id`-----

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
  clearAccessTokenCookie(res);
  res.status(204).end();
};

export const appUserController = {
  getMe,
  updateMe,
  deleteMe,
  getAll,
  getById,
  updateById,
  deleteById,
};

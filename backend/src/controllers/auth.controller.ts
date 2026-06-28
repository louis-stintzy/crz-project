import { RequestHandler } from 'express';
import { LoginInput, RegisterInput } from '../types/auth.types';
import { AppUserPublic } from '../types/appUser.types';
import { authService } from '../services/auth.service';
import {
  clearAccessTokenCookie,
  setAccessTokenCookie,
} from '../utils/auth/cookie';

const me: RequestHandler<unknown, AppUserPublic, unknown, unknown> = async (
  req,
  res
) => {
  console.log('[GET] /api/v1/auth/me');
  const currentUser = await authService.getMe(req.user!.userId); // Assuming req.user is populated by the checkAuth middleware
  res.status(200).json(currentUser);
};

const register: RequestHandler<
  unknown,
  AppUserPublic,
  RegisterInput,
  unknown
> = async (req, res) => {
  console.log('[POST] /api/v1/auth/register');
  const createdUser = await authService.register(req.body);
  res.status(201).json(createdUser);
};

const login: RequestHandler<
  unknown,
  AppUserPublic,
  LoginInput,
  unknown
> = async (req, res) => {
  console.log('[POST] /api/v1/auth/login');
  const { loggedInUser, accessToken } = await authService.login(req.body);
  setAccessTokenCookie(res, accessToken);
  res.status(200).json(loggedInUser);
};

const logout: RequestHandler<unknown, unknown, unknown, unknown> = (
  _req,
  res
) => {
  clearAccessTokenCookie(res);
  res.status(204).end();
};

export const authController = {
  register,
  login,
  logout,
  me,
};

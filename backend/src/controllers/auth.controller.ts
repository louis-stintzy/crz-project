import { RequestHandler } from 'express';
import { RegisterInput } from '../types/auth.types';
import { AppUserPublic } from '../types/appUser.types';
import { authService } from '../services/auth.service';

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

const login: RequestHandler = async (req, res) => {
  res.send('User login endpoint');
};

const logout: RequestHandler = async (req, res) => {
  res.send('User logout endpoint');
};

export const authController = {
  register,
  login,
  logout,
};

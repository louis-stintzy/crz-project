import { RequestHandler } from 'express';
import { LoginInput, RegisterInput } from '../types/auth.types';
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

const login: RequestHandler<
  unknown,
  AppUserPublic,
  LoginInput,
  unknown
> = async (req, res) => {
  const loggedInUser = await authService.login(req.body);
  res.status(200).json(loggedInUser);
};

const logout: RequestHandler = async (req, res) => {
  res.send('User logout endpoint');
};

export const authController = {
  register,
  login,
  logout,
};

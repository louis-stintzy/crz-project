import { RequestHandler } from 'express';

const register: RequestHandler = async (req, res) => {
  res.send('User registration endpoint');
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

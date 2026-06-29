import { env } from '../../config/env';
import { CookieOptions, Response } from 'express';

const commonCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax', // TODO: à voir suite déploiement
};

export const setAccessTokenCookie = (
  res: Response,
  accessToken: string
): void => {
  res.cookie('access_token', accessToken, {
    ...commonCookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds as the access token expires in 1 hour
  });
};

export const clearAccessTokenCookie = (res: Response): void => {
  res.clearCookie('access_token', {
    ...commonCookieOptions,
  });
};

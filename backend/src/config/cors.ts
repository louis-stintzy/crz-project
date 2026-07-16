import { CorsOptions } from 'cors';
import { env } from './env';
import { CorsError } from '../errors/AppError';

const allowedOrigins = env.CORS_ORIGIN;
const isDev = env.NODE_ENV === 'development';
const isTest = env.NODE_ENV === 'test'; // Jest sets NODE_ENV=test

export const corsOptions: CorsOptions = {
  /**
   * Validate origin
   * development mode allows all origins (Postman...)
   * production mode only allows origins from the allowedOrigins list
   */
  origin: (origin, callback) => {
    if (
      ((isDev || isTest) && !origin) ||
      (origin && allowedOrigins.includes(origin))
    ) {
      callback(null, true);
    } else {
      callback(new CorsError(origin ?? 'no origin'));
    }
  },
  credentials: true,
};

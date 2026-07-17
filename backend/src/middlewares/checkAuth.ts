import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ValidationError } from '../errors/AppError';
import { verifyAccessToken } from '../utils/auth/token';
import { accessTokenPayloadSchema } from '../schemas/auth.schema';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const checkAuth = () => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // 1 - Check if the access_token cookie is present
    const { access_token } = req.cookies;
    if (!access_token || typeof access_token !== 'string')
      return next(new UnauthorizedError('Access token is missing'));

    // 2 - Verify the token to check if it matches the provided accessToken
    try {
      // note: jsonwebtoken adds `iat` and `exp` to the decoded payload. The `accessTokenPayloadSchema` schema is not `.strict()`, so Zod accepts the payload even if it contains additional fields, and `result.data` will contain only: `{  userId: string; }`
      const payload = verifyAccessToken(access_token);
      const result = accessTokenPayloadSchema.safeParse(payload);
      if (!result.success) {
        return next(
          new ValidationError(
            `Access token payload validation failed: ${result.error.message.toString()}`
          )
        );
      }
      req.user = result.data;
      return next();
    } catch (error) {
      // 3 - Handle the case where the token is invalid or expired
      if (error instanceof TokenExpiredError) {
        return next(new UnauthorizedError('Access token has expired'));
      } else if (error instanceof JsonWebTokenError) {
        return next(new UnauthorizedError('Access token is invalid'));
      } else {
        return next(new UnauthorizedError('Access token verification failed'));
      }
    }
  };
};

import { env } from '../../config/env';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AccessTokenPayload } from '../../types/auth.types';

const ACCESS_TOKEN_EXPIRATION = '1h'; // 1 hour as the cookie is set to expire in 1 hour, so the access token should also expire in 1 hour

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
}

export function verifyAccessToken(token: string): JwtPayload | string {
  return jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
}

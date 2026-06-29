import { z } from 'zod';

import {
  accessTokenPayloadSchema,
  loginSchema,
  registerSchema,
} from '../schemas/auth.schema';

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

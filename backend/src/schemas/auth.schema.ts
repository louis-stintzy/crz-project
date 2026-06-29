import { z } from 'zod';
import { appUserBaseSchema } from './appUser.schema';

export const accessTokenPayloadSchema = z.object({
  userId: z.uuid('Invalid app user ID'),
});

export const registerSchema = appUserBaseSchema;

export const loginSchema = z
  .object({
    email: z
      .email('Invalid email format')
      .max(255, 'Email must contain at most 255 characters'),

    password: z.string().min(1, 'Password is required'),
  })
  .strict();

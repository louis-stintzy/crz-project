import { z } from 'zod';
import { registerSchema } from './auth.schema';

export const appUserIdParamSchema = z.object({
  id: z.uuid('Invalid app user ID'),
});

export const updateAppUserSchema = registerSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  );

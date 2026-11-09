import { z } from 'zod';

export const closetIdParamSchema = z.object({
  id: z.uuid('Invalid closet ID'),
});

export const createClosetSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(255, 'Name must contain at most 255 characters'),
    description: z.string().trim().nullable().optional(),
  })
  .strict();

export const updateClosetSchema = createClosetSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  );

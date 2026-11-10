import { z } from 'zod';
import {
  closetIdParamSchema,
  createClosetSchema,
  updateClosetSchema,
} from '../schemas/closet.schema';

export type ClosetIdParams = z.infer<typeof closetIdParamSchema>;
export type ClosetId = ClosetIdParams['id'];

export type CreateClosetDTO = z.infer<typeof createClosetSchema>;
export type UpdateClosetDTO = z.infer<typeof updateClosetSchema>;

// Database row (snake_case columns).
export interface ClosetDb {
  id: ClosetId;
  user_id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date | null;
}

// Response sent to the frontend (camelCase).
export interface Closet {
  id: ClosetId;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

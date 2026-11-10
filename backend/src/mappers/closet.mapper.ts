import { Closet, ClosetDb } from '../types/closet.types';

export const mapClosetDbToPublic = (closet: ClosetDb): Closet => ({
  id: closet.id,
  userId: closet.user_id,
  name: closet.name,
  description: closet.description,
  createdAt: closet.created_at,
  updatedAt: closet.updated_at,
});

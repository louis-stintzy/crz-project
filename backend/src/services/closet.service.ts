import { ConflictError, NotFoundError } from '../errors/AppError';
import { mapClosetDbToPublic } from '../mappers/closet.mapper';
import { closetRepository } from '../repositories/closet.repository';
import {
  Closet,
  ClosetId,
  CreateClosetDTO,
  UpdateClosetDTO,
} from '../types/closet.types';

// PostgreSQL UNIQUE violation (user_id, name).
const isUniqueViolation = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === '23505';

const getAll = async (userId: string): Promise<Closet[]> => {
  const closets = await closetRepository.findAllByUserId(userId);
  return closets.map(mapClosetDbToPublic);
};

const getById = async (id: ClosetId, userId: string): Promise<Closet> => {
  const closet = await closetRepository.findById(id, userId);
  if (!closet) throw new NotFoundError('closet', id);
  return mapClosetDbToPublic(closet);
};

const create = async (
  userId: string,
  data: CreateClosetDTO
): Promise<Closet> => {
  try {
    const closet = await closetRepository.create(userId, data);
    return mapClosetDbToPublic(closet);
  } catch (error) {
    if (isUniqueViolation(error))
      throw new ConflictError('A closet with this name already exists');
    throw error;
  }
};

const updateById = async (
  id: ClosetId,
  userId: string,
  data: UpdateClosetDTO
): Promise<Closet> => {
  try {
    const closet = await closetRepository.updateById(id, userId, data);
    if (!closet) throw new NotFoundError('closet', id);
    return mapClosetDbToPublic(closet);
  } catch (error) {
    if (isUniqueViolation(error))
      throw new ConflictError('A closet with this name already exists');
    throw error;
  }
};

const deleteById = async (id: ClosetId, userId: string): Promise<void> => {
  const deleted = await closetRepository.deleteById(id, userId);
  if (!deleted) throw new NotFoundError('closet', id);
};

export const closetService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

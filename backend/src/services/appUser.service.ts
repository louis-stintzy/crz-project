import { NotFoundError } from '../errors/AppError';
import { appUserRepository } from '../repositories/appUser.repository';
import { AppUserDb, AppUserId, AppUserPublic } from '../types/appUser.types';

const mapAppUserDbToPublic = (user: AppUserDb): AppUserPublic => {
  return {
    id: user.id,
    pseudo: user.pseudo,
    email: user.email,
    pictureUrl: user.picture_url,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

const getAll = async (): Promise<AppUserPublic[]> => {
  const users = await appUserRepository.findAll();
  return users.map((user) => mapAppUserDbToPublic(user));
};

const getById = async (id: AppUserId): Promise<AppUserPublic> => {
  const user = await appUserRepository.findById(id);
  if (!user) {
    throw new NotFoundError(`app_user`, id);
  }
  return mapAppUserDbToPublic(user);
};

export const appUserService = {
  getAll,
  getById,
};

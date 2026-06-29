import { ConflictError, NotFoundError } from '../errors/AppError';
import { mapAppUserDbToPublic } from '../mappers/appUser.mapper';
import { appUserRepository } from '../repositories/appUser.repository';
import {
  AppUserId,
  AppUserPublic,
  UpdateAppUserDTO,
  UpdateAppUserRepositoryData,
} from '../types/appUser.types';
import { hashPassword } from '../utils/auth/hash';

const getAll = async (): Promise<AppUserPublic[]> => {
  const users = await appUserRepository.findAll();
  return users.map((user) => mapAppUserDbToPublic(user));
};

const getById = async (id: AppUserId): Promise<AppUserPublic> => {
  const user = await appUserRepository.findById(id);
  if (!user) throw new NotFoundError(`app_user`, id);
  return mapAppUserDbToPublic(user);
};

// TODO(db-errors): catch PostgreSQL unique violation errors (23505)
// around this update to handle concurrent email/pseudo conflicts consistently.
// Planned fix: convert 23505 errors into ConflictError.

const updateById = async (
  id: AppUserId,
  data: UpdateAppUserDTO
): Promise<AppUserPublic> => {
  // Check if the user exists
  const existingUser = await appUserRepository.findById(id);
  if (!existingUser) throw new NotFoundError('app_user', id);

  // Check if the email is already used by another user
  if (data.email && data.email !== existingUser.email) {
    const existingUserByEmail = await appUserRepository.findByEmail(data.email);
    if (existingUserByEmail && existingUserByEmail.id !== id)
      throw new ConflictError(`Email already used: ${data.email}`);
  }

  // Check if the pseudo is already used by another user
  if (data.pseudo && data.pseudo !== existingUser.pseudo) {
    const existingUserByPseudo = await appUserRepository.findByPseudo(
      data.pseudo
    );
    if (existingUserByPseudo && existingUserByPseudo.id !== id)
      throw new ConflictError(`Pseudo already used: ${data.pseudo}`);
  }

  // Hash the password if it's provided
  let passwordHash: string | undefined;
  if (data.password !== undefined) {
    passwordHash = await hashPassword(data.password);
  }

  // Update the user
  const updatePayload: UpdateAppUserRepositoryData = {};
  if (data.pseudo !== undefined) updatePayload.pseudo = data.pseudo;
  if (data.email !== undefined) updatePayload.email = data.email;
  if (passwordHash !== undefined) updatePayload.passwordHash = passwordHash;
  if (data.pictureUrl !== undefined) updatePayload.pictureUrl = data.pictureUrl;
  const updatedUser = await appUserRepository.updateById(id, updatePayload);

  if (!updatedUser) throw new NotFoundError('app_user', id);
  return mapAppUserDbToPublic(updatedUser);
};

const deleteById = async (id: AppUserId): Promise<void> => {
  const hasDeletedUser = await appUserRepository.deleteById(id);
  if (!hasDeletedUser) throw new NotFoundError('app_user', id);
  return;
};

export const appUserService = {
  getAll,
  getById,
  updateById,
  deleteById,
};

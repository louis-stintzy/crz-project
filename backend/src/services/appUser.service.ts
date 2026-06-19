import { ConflictError, NotFoundError } from '../errors/AppError';
import { appUserRepository } from '../repositories/appUser.repository';
import {
  AppUserDb,
  AppUserId,
  AppUserPublic,
  CreateAppUserDTO,
  UpdateAppUserDTO,
  UpdateAppUserRepositoryData,
} from '../types/appUser.types';
import { hashPassword } from '../utils/auth/hash';

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

// TODO(db-errors): catch PostgreSQL unique violation errors (23505)
// around this insert to handle concurrent duplicate email/pseudo requests.
// Current pre-checks are useful for friendly errors, but they are not enough
// under concurrent requests because the database UNIQUE constraint may still fail.
// Planned fix: convert 23505 errors into ConflictError instead of returning a generic 500

const create = async (data: CreateAppUserDTO): Promise<AppUserPublic> => {
  // Check if the user already exists
  const existingUserByEmail = await appUserRepository.findByEmail(data.email);
  if (existingUserByEmail)
    throw new ConflictError(`Email already used: ${data.email}`);
  const existingUserByPseudo = await appUserRepository.findByPseudo(
    data.pseudo
  );
  if (existingUserByPseudo)
    throw new ConflictError(`Pseudo already used: ${data.pseudo}`);

  // Create the user
  const passwordHash = await hashPassword(data.password);
  const createdUser = await appUserRepository.create({
    pseudo: data.pseudo,
    email: data.email,
    passwordHash,
    pictureUrl: data.pictureUrl ?? null,
  });

  return mapAppUserDbToPublic(createdUser);
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
  create,
  updateById,
  deleteById,
};

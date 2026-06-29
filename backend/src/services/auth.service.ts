import { ConflictError, UnauthorizedError } from '../errors/AppError';
import { mapAppUserDbToPublic } from '../mappers/appUser.mapper';
import { appUserRepository } from '../repositories/appUser.repository';
import { AppUserPublic } from '../types/appUser.types';
import { LoginInput, RegisterInput } from '../types/auth.types';
import { comparePassword, hashPassword } from '../utils/auth/hash';
import { generateAccessToken } from '../utils/auth/token';

// TODO(db-errors): catch PostgreSQL unique violation errors (23505)
// around this insert to handle concurrent duplicate email/pseudo requests.
// Current pre-checks are useful for friendly errors, but they are not enough
// under concurrent requests because the database UNIQUE constraint may still fail.
// Planned fix: convert 23505 errors into ConflictError instead of returning a generic 500

const register = async (data: RegisterInput): Promise<AppUserPublic> => {
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

const login = async (
  data: LoginInput
): Promise<{ loggedInUser: AppUserPublic; accessToken: string }> => {
  // 1 - Find user by email
  const user = await appUserRepository.findByEmail(data.email);
  if (!user)
    throw new UnauthorizedError(
      `Invalid credentials (email not found) for route /login with email: ${data.email}` // internal message for debugging, not exposed to the client
    );
  // 2 - Verify the password
  const isPasswordValid = await comparePassword(
    data.password,
    user.password_hash
  );
  if (!isPasswordValid)
    throw new UnauthorizedError(
      `Invalid credentials (incorrect password) for route /login with email: ${data.email}` // internal message for debugging, not exposed to the client
    );

  // 3 - If the password is valid, generate an access token and return the user data
  const loggedInUser = mapAppUserDbToPublic(user);
  const accessToken = generateAccessToken({
    userId: user.id,
  });

  return {
    loggedInUser,
    accessToken,
  };
};

export const authService = {
  register,
  login,
};

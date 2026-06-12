import { pool } from '../db/db_connect';
import { AppUserDb, AppUserId } from '../types/appUser.types';

const findAll = async (): Promise<AppUserDb[]> => {
  const query = `
    SELECT
      id,
      pseudo,
      email,
      password_hash,
      picture_url,
      created_at,
      updated_at
    FROM app_user
    ORDER BY created_at DESC;
  `;
  const result = await pool.query<AppUserDb>(query);
  return result.rows;
};

const findById = async (id: AppUserId): Promise<AppUserDb | null> => {
  const query = `
  SELECT
    id,
      pseudo,
      email,
      password_hash,
      picture_url,
      created_at,
      updated_at
    FROM app_user
    WHERE id = $1
  `;
  const value = [id];
  const result = await pool.query<AppUserDb>(query, value);
  return result.rows[0] ?? null;
};

const findByEmail = async (email: string): Promise<AppUserDb | null> => {
  const query = `
  SELECT
    id,
      pseudo,
      email,
      password_hash,
      picture_url,
      created_at,
      updated_at
    FROM app_user
    WHERE email = $1
  `;
  const value = [email];
  const result = await pool.query<AppUserDb>(query, value);
  return result.rows[0] ?? null;
};

const findByPseudo = async (pseudo: string): Promise<AppUserDb | null> => {
  const query = `
  SELECT
    id,
      pseudo,
      email,
      password_hash,
      picture_url,
      created_at,
      updated_at
    FROM app_user
    WHERE pseudo = $1
  `;
  const value = [pseudo];
  const result = await pool.query<AppUserDb>(query, value);
  return result.rows[0] ?? null;
};

export const appUserRepository = {
  findAll,
  findById,
  findByEmail,
  findByPseudo,
};

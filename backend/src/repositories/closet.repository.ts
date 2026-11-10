import { pool } from '../db/db_connect';
import {
  ClosetDb,
  ClosetId,
  CreateClosetDTO,
  UpdateClosetDTO,
} from '../types/closet.types';

const findAllByUserId = async (userId: string): Promise<ClosetDb[]> => {
  const query = `
    SELECT id, user_id, name, description, created_at, updated_at
    FROM closet
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query<ClosetDb>(query, [userId]);
  return result.rows;
};

const findById = async (
  id: ClosetId,
  userId: string
): Promise<ClosetDb | null> => {
  const query = `
    SELECT id, user_id, name, description, created_at, updated_at
    FROM closet
    WHERE id = $1 AND user_id = $2;
  `;
  const result = await pool.query<ClosetDb>(query, [id, userId]);
  return result.rows[0] ?? null;
};

const create = async (
  userId: string,
  data: CreateClosetDTO
): Promise<ClosetDb> => {
  const query = `
    INSERT INTO closet (user_id, name, description)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, name, description, created_at, updated_at;
  `;
  const result = await pool.query<ClosetDb>(query, [
    userId,
    data.name,
    data.description ?? null,
  ]);
  return result.rows[0]!;
};

const updateById = async (
  id: ClosetId,
  userId: string,
  data: UpdateClosetDTO
): Promise<ClosetDb | null> => {
  const fieldsToUpdate: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    fieldsToUpdate.push(`name = $${paramIndex++}`);
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fieldsToUpdate.push(`description = $${paramIndex++}`);
    values.push(data.description);
  }

  // Empty updates are rejected by Zod; this also prevents invalid SQL
  // if the repository is called without HTTP validation.
  if (fieldsToUpdate.length === 0) return findById(id, userId);

  fieldsToUpdate.push('updated_at = NOW()');
  values.push(id, userId);

  const query = `
    UPDATE closet
    SET ${fieldsToUpdate.join(', ')}
    WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
    RETURNING id, user_id, name, description, created_at, updated_at;
  `;
  const result = await pool.query<ClosetDb>(query, values);
  return result.rows[0] ?? null;
};

const deleteById = async (id: ClosetId, userId: string): Promise<boolean> => {
  const query = `
    DELETE FROM closet
    WHERE id = $1 AND user_id = $2;
  `;
  const result = await pool.query(query, [id, userId]);
  return result.rowCount === 1;
};

export const closetRepository = {
  findAllByUserId,
  findById,
  create,
  updateById,
  deleteById,
};

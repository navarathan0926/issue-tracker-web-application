import pool from '../config/db.js';
import type { UserRow } from '../types/index.js';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

/**
 * Find a user record by email address.
 */
export const findUserByEmail = async (email: string): Promise<UserRow | undefined> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM Users WHERE email = ?',
    [email],
  );
  return rows[0] as UserRow | undefined;
};

/**
 * Insert a new user and return the generated auto-increment id.
 */
export const createUser = async (email: string, passwordHash: string): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO Users (email, password_hash) VALUES (?, ?)',
    [email, passwordHash],
  );
  return result.insertId;
};

/**
 * Fetch a user by primary key (password_hash is excluded from the projection).
 */
export const findUserById = async (id: number): Promise<Omit<UserRow, 'password_hash'> | undefined> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, email, created_at, updated_at FROM Users WHERE id = ?',
    [id],
  );
  return rows[0] as Omit<UserRow, 'password_hash'> | undefined;
};

import pool from '../config/db.js';

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0];
};

export const createUser = async (email, passwordHash) => {
  const [result] = await pool.query(
    'INSERT INTO Users (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  );
  return result.insertId;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, email, created_at, updated_at FROM Users WHERE id = ?', [id]);
  return rows[0];
};

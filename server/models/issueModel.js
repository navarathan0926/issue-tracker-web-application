import pool from '../config/db.js';

export const createIssue = async (issueData) => {
  const { title, description, status, priority, user_id } = issueData;
  const [result] = await pool.query(
    'INSERT INTO Issues (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, status || 'OPEN', priority || 'MEDIUM', user_id]
  );
  return result.insertId;
};

export const getIssues = async (userId, filters, page, limit) => {
  let query = 'SELECT * FROM Issues WHERE user_id = ?';
  const queryParams = [userId];

  if (filters.search) {
    query += ' AND title LIKE ?';
    queryParams.push(`%${filters.search}%`);
  }
  if (filters.status) {
    query += ' AND status = ?';
    queryParams.push(filters.status);
  }
  if (filters.priority) {
    query += ' AND priority = ?';
    queryParams.push(filters.priority);
  }

  // Count total entries considering filters
  const [countResult] = await pool.query(query.replace('*', 'COUNT(*) as total'), queryParams);
  const total = countResult[0].total;

  query += ' ORDER BY created_at DESC';

  if (limit) {
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));
  }

  const [rows] = await pool.query(query, queryParams);
  return { data: rows, total };
};

export const getIssueById = async (id, userId) => {
  const [rows] = await pool.query('SELECT * FROM Issues WHERE id = ? AND user_id = ?', [id, userId]);
  return rows[0];
};

export const updateIssue = async (id, userId, issueData) => {
  let query = 'UPDATE Issues SET ';
  const queryParams = [];
  const fields = [];

  for (const [key, value] of Object.entries(issueData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      queryParams.push(value);
    }
  }

  if (fields.length === 0) return 0;

  query += fields.join(', ') + ' WHERE id = ? AND user_id = ?';
  queryParams.push(id, userId);

  const [result] = await pool.query(query, queryParams);
  return result.affectedRows;
};

export const deleteIssue = async (id, userId) => {
  const [result] = await pool.query('DELETE FROM Issues WHERE id = ? AND user_id = ?', [id, userId]);
  return result.affectedRows;
};

export const getIssueStatsByStatus = async (userId) => {
    const [rows] = await pool.query('SELECT status, COUNT(*) as count FROM Issues WHERE user_id = ? GROUP BY status', [userId]);
    return rows;
}

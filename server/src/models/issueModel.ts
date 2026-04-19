import pool from '../config/db.js';
import type {
  IssueRow,
  CreateIssueInput,
  UpdateIssueInput,
  IssueFilters,
  PaginatedResult,
  StatusCountRow,
} from '../types/index.js';
import { IssueStatus, IssuePriority } from '../types/index.js';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

// ─── Internal DB row type ─────────────────────────────────────────────────────

interface IssueDbRow extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

interface CountRow extends RowDataPacket {
  total: number;
}

interface StatusCountDbRow extends RowDataPacket {
  status: IssueStatus;
  count: number;
}

// ─── Model functions ──────────────────────────────────────────────────────────

export const createIssue = async (
  issueData: CreateIssueInput & { user_id: number },
): Promise<number> => {
  const { title, description, status, priority, user_id } = issueData;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO Issues (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, description ?? null, status, priority, user_id],
  );
  return result.insertId;
};

export const getIssues = async (
  userId: number,
  filters: IssueFilters,
  page: number,
  limit: number,
): Promise<PaginatedResult<IssueRow>> => {
  let query = 'SELECT * FROM Issues WHERE user_id = ?';
  const queryParams: (string | number)[] = [userId];

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
  const [countResult] = await pool.query<CountRow[]>(
    query.replace('SELECT *', 'SELECT COUNT(*) as total'),
    queryParams,
  );
  const total = countResult[0]?.total ?? 0;

  query += ' ORDER BY created_at DESC';

  const offset = (page - 1) * limit;
  query += ' LIMIT ? OFFSET ?';
  queryParams.push(limit, offset);

  const [rows] = await pool.query<IssueDbRow[]>(query, queryParams);
  return { data: rows as IssueRow[], total };
};

export const getIssueById = async (
  id: number,
  userId: number,
): Promise<IssueRow | undefined> => {
  const [rows] = await pool.query<IssueDbRow[]>(
    'SELECT * FROM Issues WHERE id = ? AND user_id = ?',
    [id, userId],
  );
  return rows[0] as IssueRow | undefined;
};

export const updateIssue = async (
  id: number,
  userId: number,
  issueData: UpdateIssueInput,
): Promise<number> => {
  const fields: string[] = [];
  const queryParams: unknown[] = [];

  (Object.entries(issueData) as [string, unknown][]).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      queryParams.push(value);
    }
  });

  if (fields.length === 0) return 0;

  const query = `UPDATE Issues SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
  queryParams.push(id, userId);

  const [result] = await pool.query<ResultSetHeader>(query, queryParams);
  return result.affectedRows;
};

export const deleteIssue = async (id: number, userId: number): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM Issues WHERE id = ? AND user_id = ?',
    [id, userId],
  );
  return result.affectedRows;
};

export const getIssueStatsByStatus = async (userId: number): Promise<StatusCountRow[]> => {
  const [rows] = await pool.query<StatusCountDbRow[]>(
    'SELECT status, COUNT(*) as count FROM Issues WHERE user_id = ? GROUP BY status',
    [userId],
  );
  return rows as StatusCountRow[];
};

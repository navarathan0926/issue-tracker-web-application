// ─── Enums ───────────────────────────────────────────────────────────────────

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// ─── Database Row Shapes ──────────────────────────────────────────────────────

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface IssueRow {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface StatusCountRow {
  status: IssueStatus;
  count: number;
}

// ─── Service / DTO Shapes ─────────────────────────────────────────────────────

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: SafeUser;
}

export interface SafeUser {
  id: number;
  email: string;
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
}

export interface IssueFilters {
  search?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

// ─── Express Augmentation ─────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

import { IssueStatus, IssuePriority } from '../types/index.js';

export const VALID_STATUSES: IssueStatus[] = Object.values(IssueStatus);
export const VALID_PRIORITIES: IssuePriority[] = Object.values(IssuePriority);
export const JWT_EXPIRES_IN = '24h';
export const BCRYPT_SALT_ROUNDS = 10;
export const DEFAULT_PAGE_LIMIT = 10;

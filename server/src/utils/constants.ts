import { IssueStatus, IssuePriority } from '../types/index.js';

/** Valid values for the `status` column */
export const VALID_STATUSES: IssueStatus[] = Object.values(IssueStatus);

/** Valid values for the `priority` column */
export const VALID_PRIORITIES: IssuePriority[] = Object.values(IssuePriority);

/** Default JWT expiry */
export const JWT_EXPIRES_IN = '24h';

/** Default bcrypt salt rounds */
export const BCRYPT_SALT_ROUNDS = 10;

/** Default pagination limit */
export const DEFAULT_PAGE_LIMIT = 10;

import * as issueModel from '../models/issueModel.js';
import { IssueStatus, IssuePriority } from '../types/index.js';
import type {
  IssueRow,
  CreateIssueInput,
  UpdateIssueInput,
  IssueFilters,
  PaginatedResult,
  StatusCountRow,
} from '../types/index.js';

/**
 * Create a new issue for `userId`.
 * Applies default status (OPEN) and priority (MEDIUM) if not provided.
 */
export const createIssue = async (
  issueData: CreateIssueInput,
  userId: number,
): Promise<IssueRow> => {
  const { title, description, status, priority } = issueData;

  if (!title?.trim()) {
    throw new Error('Title is required');
  }

  const issue = {
    title: title.trim(),
    description,
    status: status ?? IssueStatus.OPEN,
    priority: priority ?? IssuePriority.MEDIUM,
    user_id: userId,
  };

  const issueId = await issueModel.createIssue(issue);
  const created = await issueModel.getIssueById(issueId, userId);
  if (!created) throw new Error('Issue creation failed');
  return created;
};

/**
 * Return paginated issues for `userId`, filtered by optional criteria.
 */
export const getIssues = async (
  userId: number,
  filters: IssueFilters,
  page: number,
  limit: number,
): Promise<PaginatedResult<IssueRow>> => {
  return issueModel.getIssues(userId, filters, page, limit);
};

/**
 * Fetch a single issue by id. Throws if not found or not owned by `userId`.
 */
export const getIssueById = async (id: number, userId: number): Promise<IssueRow> => {
  const issue = await issueModel.getIssueById(id, userId);
  if (!issue) {
    throw new Error('Issue not found');
  }
  return issue;
};

/**
 * Apply partial updates to an issue. Throws if no matching row was changed.
 */
export const updateIssue = async (
  id: number,
  userId: number,
  issueData: UpdateIssueInput,
): Promise<IssueRow> => {
  const affectedRows = await issueModel.updateIssue(id, userId, issueData);
  if (affectedRows === 0) {
    throw new Error('Issue not found or no changes made');
  }
  const updated = await issueModel.getIssueById(id, userId);
  if (!updated) throw new Error('Issue not found after update');
  return updated;
};

/**
 * Permanently delete an issue owned by `userId`.
 */
export const deleteIssue = async (id: number, userId: number): Promise<void> => {
  const affectedRows = await issueModel.deleteIssue(id, userId);
  if (affectedRows === 0) {
    throw new Error('Issue not found');
  }
};

/**
 * Return a per-status count summary for `userId`.
 */
export const getIssueStatsByStatus = async (userId: number): Promise<StatusCountRow[]> => {
  return issueModel.getIssueStatsByStatus(userId);
};

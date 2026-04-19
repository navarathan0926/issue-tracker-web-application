import type { Request, Response } from 'express';
import * as issueService from '../services/issueService.js';
import { IssueStatus, IssuePriority } from '../types/index.js';
import type { CreateIssueInput, UpdateIssueInput, IssueFilters } from '../types/index.js';
import { DEFAULT_PAGE_LIMIT } from '../utils/constants.js';

// ─── Route param / query helpers ──────────────────────────────────────────────

interface IssueParams {
  id: string;
}

interface IssueQuery {
  search?: string;
  status?: string;
  priority?: string;
  page?: string;
  limit?: string;
}

// ─── Handlers ────────────────────────────────────────────────────────────────

/**
 * POST /issues
 * Create a new issue for the authenticated user.
 */
export const createIssue = async (
  req: Request<object, object, CreateIssueInput>,
  res: Response,
): Promise<void> => {
  try {
    const newIssue = await issueService.createIssue(req.body, req.user!.userId);
    res.status(201).json({ success: true, data: newIssue, message: 'Issue created' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create issue';
    res.status(400).json({ success: false, message });
  }
};

/**
 * GET /issues
 * Return a paginated, filtered list of issues for the authenticated user.
 */
export const getIssues = async (
  req: Request<object, object, object, IssueQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { search, status, priority, page = '1', limit = String(DEFAULT_PAGE_LIMIT) } = req.query;

    const filters: IssueFilters = {
      search,
      status: status as IssueStatus | undefined,
      priority: priority as IssuePriority | undefined,
    };

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || DEFAULT_PAGE_LIMIT);

    const result = await issueService.getIssues(req.user!.userId, filters, parsedPage, parsedLimit);
    const stats = await issueService.getIssueStatsByStatus(req.user!.userId);

    res.status(200).json({
      success: true,
      data: {
        issues: result.data,
        total: result.total,
        page: parsedPage,
        limit: parsedLimit,
        stats,
      },
      message: 'Fetched issues',
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /issues/:id
 * Fetch a single issue owned by the authenticated user.
 */
export const getIssueById = async (
  req: Request<IssueParams>,
  res: Response,
): Promise<void> => {
  try {
    const issue = await issueService.getIssueById(parseInt(req.params.id, 10), req.user!.userId);
    res.status(200).json({ success: true, data: issue, message: 'Fetched issue' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Issue not found';
    res.status(404).json({ success: false, message });
  }
};

/**
 * PUT /issues/:id
 * Apply a partial update to an issue owned by the authenticated user.
 */
export const updateIssue = async (
  req: Request<IssueParams, object, UpdateIssueInput>,
  res: Response,
): Promise<void> => {
  try {
    const updatedIssue = await issueService.updateIssue(
      parseInt(req.params.id, 10),
      req.user!.userId,
      req.body,
    );
    res.status(200).json({ success: true, data: updatedIssue, message: 'Issue updated' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update issue';
    res.status(400).json({ success: false, message });
  }
};

/**
 * DELETE /issues/:id
 * Delete an issue owned by the authenticated user.
 */
export const deleteIssue = async (
  req: Request<IssueParams>,
  res: Response,
): Promise<void> => {
  try {
    await issueService.deleteIssue(parseInt(req.params.id, 10), req.user!.userId);
    res.status(200).json({ success: true, message: 'Issue deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Issue not found';
    res.status(404).json({ success: false, message });
  }
};

/**
 * GET /issues/stats
 * Return per-status counts for the authenticated user (used by dashboard).
 */
export const getIssueStatsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await issueService.getIssueStatsByStatus(req.user!.userId);
    res.status(200).json({ success: true, data: stats, message: 'Fetched issue stats' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

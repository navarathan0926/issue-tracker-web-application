import * as IssueModel from '../models/issueModel.js';

const STATUS_ORDER = {
  'OPEN': 1,
  'IN_PROGRESS': 2,
  'RESOLVED': 3
};

export const createIssue = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const issueId = await IssueModel.createIssue({
      title,
      description,
      status: 'OPEN',
      priority,
      user_id: req.user.userId
    });

    const newIssue = await IssueModel.getIssueById(issueId, req.user.userId);
    res.status(201).json({ success: true, data: newIssue, message: 'Issue created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getIssues = async (req, res) => {
  try {
    const { search, status, priority, page = 1, limit = 10 } = req.query;
    
    // Status counts
    const statusCounts = await IssueModel.getIssueStatsByStatus(req.user.userId);
    
    const result = await IssueModel.getIssues(req.user.userId, { search, status, priority }, page, limit);

    res.status(200).json({ success: true, data: {
        issues: result.data,
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        stats: statusCounts
    }, message: 'Fetched issues' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await IssueModel.getIssueById(req.params.id, req.user.userId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    res.status(200).json({ success: true, data: issue, message: 'Fetched issue' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateIssue = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const issueId = req.params.id;
    const userId = req.user.userId;

    const existingIssue = await IssueModel.getIssueById(issueId, userId);
    if (!existingIssue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    // Status transition rule enforcement
    if (status && status !== existingIssue.status) {
      if (STATUS_ORDER[status] < STATUS_ORDER[existingIssue.status]) {
        return res.status(400).json({ success: false, message: 'Backward status transitions are not allowed' });
      }
    }

    const affectedRows = await IssueModel.updateIssue(issueId, userId, { title, description, status, priority });
    
    if (affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'No changes made' });
    }

    const updatedIssue = await IssueModel.getIssueById(issueId, userId);
    res.status(200).json({ success: true, data: updatedIssue, message: 'Issue updated' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const affectedRows = await IssueModel.deleteIssue(req.params.id, req.user.userId);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    res.status(200).json({ success: true, message: 'Issue deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

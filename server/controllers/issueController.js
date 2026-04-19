import * as issueService from '../services/issueService.js';

export const createIssue = async (req, res) => {
    try {
        const newIssue = await issueService.createIssue(req.body, req.user.userId);
        res.status(201).json({ success: true, data: newIssue, message: 'Issue created' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getIssues = async (req, res) => {
    try {
        const { search, status, priority, page = 1, limit = 10 } = req.query;
        const result = await issueService.getIssues(req.user.userId, { search, status, priority }, page, limit);
        const statusCounts = await issueService.getIssueStatsByStatus(req.user.userId);

        res.status(200).json({
            success: true,
            data: {
                issues: result.data,
                total: result.total,
                page: parseInt(page),
                limit: parseInt(limit),
                stats: statusCounts
            },
            message: 'Fetched issues'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getIssueById = async (req, res) => {
    try {
        const issue = await issueService.getIssueById(req.params.id, req.user.userId);
        res.status(200).json({ success: true, data: issue, message: 'Fetched issue' });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateIssue = async (req, res) => {
    try {
        const updatedIssue = await issueService.updateIssue(req.params.id, req.user.userId, req.body);
        res.status(200).json({ success: true, data: updatedIssue, message: 'Issue updated' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteIssue = async (req, res) => {
    try {
        await issueService.deleteIssue(req.params.id, req.user.userId);
        res.status(200).json({ success: true, message: 'Issue deleted' });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const getIssueStatsByStatus = async (req, res) => {
    try {
        const stats = await issueService.getIssueStatsByStatus(req.user.userId);
        res.status(200).json({ success: true, data: stats, message: 'Fetched issue stats' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

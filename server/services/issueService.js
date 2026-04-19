import * as issueModel from '../models/issueModel.js';
import { STATUS, PRIORITY } from '../utils/constants.js';

export const createIssue = async (issueData, userId) => {
    const { title, description, status, priority } = issueData;

    if (!title) {
        throw new Error('Title is required');
    }

    const issue = {
        title,
        description,
        status: status || STATUS.OPEN,
        priority: priority || PRIORITY.MEDIUM,
        user_id: userId,
    };

    const issueId = await issueModel.createIssue(issue);
    return await issueModel.getIssueById(issueId, userId);
};

export const getIssues = async (userId, filters, page, limit) => {
    return await issueModel.getIssues(userId, filters, page, limit);
};

export const getIssueById = async (id, userId) => {
    const issue = await issueModel.getIssueById(id, userId);
    if (!issue) {
        throw new Error('Issue not found');
    }
    return issue;
};

export const updateIssue = async (id, userId, issueData) => {
    const affectedRows = await issueModel.updateIssue(id, userId, issueData);
    if (affectedRows === 0) {
        throw new Error('Issue not found or no changes made');
    }
    return await issueModel.getIssueById(id, userId);
};

export const deleteIssue = async (id, userId) => {
    const affectedRows = await issueModel.deleteIssue(id, userId);
    if (affectedRows === 0) {
        throw new Error('Issue not found');
    }
};

export const getIssueStatsByStatus = async (userId) => {
    return await issueModel.getIssueStatsByStatus(userId);
};

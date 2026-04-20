import api from './api';
import type { Issue, IssueFilters, IssuesResponse } from '../types';

export const issueService = {
  getIssues: async (filters: IssueFilters) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());

    const res = await api.get<{ success: boolean; data: IssuesResponse; message: string }>(`/issues?${params.toString()}`);
    return res.data.data;
  },

  exportIssues: async (filters: Partial<IssueFilters>) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);

    const res = await api.get(`/issues/export?${params.toString()}`, {
      responseType: 'blob'
    });
    return res.data;
  },

  createIssue: async (data: Partial<Issue>) => {
    const res = await api.post<{ success: boolean; data: Issue; message: string }>('/issues', data);
    return res.data.data;
  },

  updateIssue: async (id: number, data: Partial<Issue>) => {
    const res = await api.put<{ success: boolean; data: Issue; message: string }>(`/issues/${id}`, data);
    return res.data.data;
  },

  deleteIssue: async (id: number) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/issues/${id}`);
    return res.data;
  }
};

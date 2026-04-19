export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface User {
  email: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  created_at: string;
  user_id: number;
}

export interface IssueStats {
  open: number;
  inProgress: number;
  resolved: number;
}

export interface IssuesResponse {
  issues: Issue[];
  total: number;
  page: number;
  limit: number;
  stats: { status: IssueStatus; count: number }[];
}

export interface IssueFilters {
  search?: string;
  status?: string;
  priority?: string;
  page: number;
  limit: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    email: string;
  };
}

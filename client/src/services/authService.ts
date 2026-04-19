import api from './api';
import type { AuthResponse } from '../types';

export const authService = {
  login: async (credentials: Record<string, string>) => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    return res.data;
  },
  register: async (credentials: Record<string, string>) => {
    const res = await api.post<AuthResponse>('/auth/register', credentials);
    return res.data;
  }
};

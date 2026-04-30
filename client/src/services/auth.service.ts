import api from './api';
import type { LoginPayload, SignupPayload, AuthResponse } from '../types';

export const authService = {
  login: async (payload: LoginPayload) => {
    const res = await api.post<AuthResponse>('/auth/login', payload);
    const data = res.data;
    if (data?.token) localStorage.setItem('token', data.token);
    return data;
  },

  register: async (payload: SignupPayload) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};
import api from './api';

type LoginPayload = {
  email: string;
  password: string;
};

export const authApi = {
  login: (payload: LoginPayload) => {
    return api.post('/auth/login', payload);
  },
  getCurrentUser: () => {
    return api.get('/auth/me');
  },
};
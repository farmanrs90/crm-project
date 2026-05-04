import api from './api';

export type GroupPayload = {
  name: string;
  course: string;
  teacher: string;
  startDate: string;
  endDate: string;
  capacity?: number;
  isActive?: boolean;
};

export const groupService = {
  getAll: () => api.get('/groups'),
  getById: (id: string) => api.get(`/groups/${id}`),
  create: (payload: GroupPayload) => api.post('/groups', payload),
  update: (id: string, payload: Partial<GroupPayload>) => api.put(`/groups/${id}`, payload),
  remove: (id: string) => api.delete(`/groups/${id}`),
};
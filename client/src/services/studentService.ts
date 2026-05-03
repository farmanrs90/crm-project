import api from './api';

export type StudentPayload = {
  user: string;
  lead: string;
  studentCode: string;
  enrollmentDate?: string;
  status?: string;
};

export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (payload: StudentPayload) => api.post('/students', payload),
  update: (id: string, payload: Partial<StudentPayload>) => api.put(`/students/${id}`, payload),
  remove: (id: string) => api.delete(`/students/${id}`),
};

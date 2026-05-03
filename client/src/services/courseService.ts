import api from './api';

export type CoursePayload = {
  name: string;
  category?: string;
  durationMonths?: number;
  price: number;
  description: string;
  isActive?: boolean;
  syllabus?: string;
};

export const courseService = {
  getAll: () => api.get('/courses'),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (payload: CoursePayload) => api.post('/courses', payload),
  update: (id: string, payload: Partial<CoursePayload>) => api.put(`/courses/${id}`, payload),
  remove: (id: string) => api.delete(`/courses/${id}`),
};

import api from './api';

export type LeadPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  source: string;
  status?: string;
  courseInterested?: string;
  assignedTo?: string;
  utmSource?: string;
  notes?: string;
};

export const leadService = {
  getAll: () => api.get('/leads'),
  getById: (id: string) => api.get(`/leads/${id}`),
  create: (payload: LeadPayload) => api.post('/leads', payload),
  update: (id: string, payload: LeadPayload) => api.put(`/leads/${id}`, payload),
  remove: (id: string) => api.delete(`/leads/${id}`),
};

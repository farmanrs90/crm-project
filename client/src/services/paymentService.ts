import api from './api';

export type PaymentPayload = {
  lead?: string;
  paymentPlan: string;
  installmentNumber: number;
  amountPaid: number;
  dueDate: string;
  paidAt?: string;
  status?: string;
  note?: string;
  method: string;
};

export const paymentService = {
  getAll: () => api.get('/payments'),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (payload: PaymentPayload) => api.post('/payments', payload),
  update: (id: string, payload: Partial<PaymentPayload>) => api.put(`/payments/${id}`, payload),
  remove: (id: string) => api.delete(`/payments/${id}`),
};
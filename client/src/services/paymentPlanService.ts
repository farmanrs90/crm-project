import api from './api';

export type PaymentPlanPayload = {
  planType: 'full' | 'installments';
  totalAmount: number;
  discountAmount?: number;
  note?: string;
  isActive?: boolean;
};

export const paymentPlanService = {
  getAll: () => api.get('/payment-plans'),
  getById: (id: string) => api.get(`/payment-plans/${id}`),
  create: (payload: PaymentPlanPayload) => api.post('/payment-plans', payload),
  update: (id: string, payload: Partial<PaymentPlanPayload>) => api.put(`/payment-plans/${id}`, payload),
  remove: (id: string) => api.delete(`/payment-plans/${id}`),
};
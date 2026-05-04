import api from './api';

export type DashboardSummary = {
  totals?: {
    users?: number;
    students?: number;
    leads?: number;
    courses?: number;
    enrollments?: number;
    payments?: number;
    teachers?: number;
    paymentsPending?: number;
  };
  recent?: {
    leads?: Array<{ _id: string; firstName?: string; lastName?: string; status?: string }>;
    payments?: Array<{ _id: string; installmentNumber?: number; status?: string; amountPaid?: number }>;
    enrollments?: Array<{ _id: string }>;
    teachers?: Array<{ _id: string; firstName?: string; lastName?: string }>;
  };
};

export const dashboardService = {
  getSummary: () => api.get<DashboardSummary>('/dashboard'),
};
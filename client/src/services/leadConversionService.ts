import api from './api';

export interface ConvertLeadToStudentPayload {
  leadId: string;
  courseId?: string;
  groupId?: string;
  notes?: string;
}

export interface ConvertedStudent {
  _id: string;
  lead: string;
  studentCode: string;
  enrollmentDate: string;
  status: string;
  user?: {
    _id: string;
    email: string;
    name: string;
  };
}

export const leadConversionService = {
  convertToStudent: async (payload: ConvertLeadToStudentPayload) => {
    return api.post<ConvertedStudent>('/leads/convert-to-student', payload);
  },

  getConversionStatus: async (leadId: string) => {
    return api.get<{ isConverted: boolean; studentId?: string }>(`/leads/${leadId}/conversion-status`);
  },
};

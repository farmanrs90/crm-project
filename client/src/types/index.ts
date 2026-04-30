export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'manager' | 'student' | 'accountant';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'teacher' | 'manager' | 'student' | 'accountant';
}

export interface Student {
  _id: string;
  userId: string;
  phoneNumber: string;
  enrollmentStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  _id: string;
  studentId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}
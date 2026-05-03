import { create } from 'zustand';
import { authApi } from '../services/authApi';

type User = {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  data?: {
    token?: string;
    user?: User;
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  logout: () => void;
  setUser: (u: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('token')),
  setUser: (u) => set({ user: u, isAuthenticated: !!u }),
  login: async (payload: LoginPayload) => {
    const res = (await authApi.login(payload)) as LoginResponse;
    const token = res?.data?.token;
    const user = res?.data?.user || null;
    if (token) {
      localStorage.setItem('token', token);
      set({ token, user, isAuthenticated: true });
    }
    return res;
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },
  getCurrentUser: async () => {
    try {
      const res = await authApi.getCurrentUser();
      const user = res?.data || null;
      set({ user });
      return res;
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      throw error;
    }
  },
}));

export default useAuthStore;

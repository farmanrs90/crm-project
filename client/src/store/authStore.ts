import { create } from 'zustand';
import type { User, LoginPayload } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (u: User | null) => void;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  setUser: (u) => set({ user: u, isAuthenticated: !!u }),
  login: async (payload) => {
    const data = await authService.login(payload);
    if (data?.token) {
      const user: User = {
        _id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: 'manager',
      };
      localStorage.setItem('token', data.token);
      set({ token: data.token, user, isAuthenticated: true });
    }
  },
  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
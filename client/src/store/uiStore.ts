import { create } from 'zustand';
import type { Language } from '../localization/translations';

type ThemeMode = 'light' | 'dark';

interface UiState {
  language: Language;
  theme: ThemeMode;
  setLanguage: (language: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('language');
  return stored === 'az' || stored === 'ru' || stored === 'en' ? stored : 'en';
};

const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
};

export const useUiStore = create<UiState>((set, get) => ({
  language: getStoredLanguage(),
  theme: getStoredTheme(),
  setLanguage: (language) => {
    localStorage.setItem('language', language);
    set({ language });
  },
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.style.colorScheme = theme;
    }
    set({ theme });
  },
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
}));

if (typeof document !== 'undefined') {
  const initialTheme = useUiStore.getState().theme;
  document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  document.documentElement.style.colorScheme = initialTheme;
}

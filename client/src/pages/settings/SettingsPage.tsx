import useAuthStore from '../../store/authStore';
import { getTranslation, languageLabels } from '../../localization/translations';
import { useUiStore } from '../../store/uiStore';

export default function SettingsPage() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const language = useUiStore((s) => s.language);
  const theme = useUiStore((s) => s.theme);
  const setLanguage = useUiStore((s) => s.setLanguage);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-sm dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">{t('settings')}</h1>
        <p className="mt-2 text-sm text-slate-300">{t('basicSettings')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('currentToken')}</p>
            <p className="break-all text-sm text-slate-900 dark:text-slate-100">{token || t('noToken')}</p>
          </div>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500" onClick={logout}>{t('logout')}</button>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{t('language')}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">AZ / RU / EN</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'az' | 'ru')}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {Object.entries(languageLabels).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{t('theme')}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{theme === 'dark' ? t('dark') : t('light')}</p>
            </div>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800" onClick={toggleTheme}>
              {theme === 'dark' ? t('light') : t('dark')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { getTranslation } from '../../localization/translations';
import useAuthStore from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';

export default function SettingsPage() {
  const logout = useAuthStore((s) => s.logout);
  const language = useUiStore((s) => s.language);

  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-sm dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">{t('settings')}</h1>
        <p className="mt-2 text-sm text-slate-300">{t('basicSettings')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{t('language')}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Theme and language controls live in the top navbar.</p>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500" onClick={logout}>{t('logout')}</button>
        </div>
      </div>
    </div>
  );
}

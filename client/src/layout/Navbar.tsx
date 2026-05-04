
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getTranslation, languageLabels } from '../localization/translations';
import { useUiStore } from '../store/uiStore';

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition ${isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;

export default function Navbar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const language = useUiStore((s) => s.language);
  const theme = useUiStore((s) => s.theme);
  const setLanguage = useUiStore((s) => s.setLanguage);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  const t = (key: string) => getTranslation(language, key);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 text-slate-900 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 dark:text-slate-100">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{t('appName')}</p>
          <h3 className="text-lg font-semibold leading-tight">{t('adminDashboard')}</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:block dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? t('dark') : t('light')}
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'az' | 'ru')}
            className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 outline-none transition sm:block dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {Object.entries(languageLabels).map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:block dark:bg-slate-800 dark:text-slate-200">
            {t('connected')}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
        <NavLink to="/dashboard" className={mobileLinkClass}>{t('dashboard')}</NavLink>
        <NavLink to="/leads" className={mobileLinkClass}>{t('leads')}</NavLink>
        <NavLink to="/students" className={mobileLinkClass}>{t('students')}</NavLink>
        <NavLink to="/courses" className={mobileLinkClass}>{t('courses')}</NavLink>
        <NavLink to="/groups" className={mobileLinkClass}>{t('groups')}</NavLink>
        <NavLink to="/payments" className={mobileLinkClass}>{t('payments')}</NavLink>
        <NavLink to="/settings" className={mobileLinkClass}>{t('settings')}</NavLink>
      </nav>
    </header>
  );
}

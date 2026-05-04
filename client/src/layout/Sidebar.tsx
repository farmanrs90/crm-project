import { NavLink } from 'react-router-dom';
import { getTranslation } from '../localization/translations';
import { useUiStore } from '../store/uiStore';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-slate-800 font-semibold text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`;

export default function Sidebar() {
  const language = useUiStore((s) => s.language);
  const t = (key: string) => getTranslation(language, key);

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200/80 bg-slate-950 px-4 py-5 text-slate-100 shadow-[10px_0_40px_rgba(15,23,42,0.12)] md:block dark:border-slate-800">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">{t('appName')}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-wide text-white">{t('adminDashboard')}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {t('overview')}
        </p>
      </div>

      <nav className="mt-6 space-y-4">
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{t('core')}</p>
          <div className="space-y-1">
            <NavLink to="/dashboard" className={linkClass}>{t('dashboard')}</NavLink>
            <NavLink to="/leads" className={linkClass}>{t('leads')}</NavLink>
            <NavLink to="/students" className={linkClass}>{t('students')}</NavLink>
            <NavLink to="/courses" className={linkClass}>{t('courses')}</NavLink>
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{t('operations')}</p>
          <div className="space-y-1">
            <NavLink to="/groups" className={linkClass}>{t('groups')}</NavLink>
            <NavLink to="/payments" className={linkClass}>{t('payments')}</NavLink>
            <NavLink to="/payment-plans" className={linkClass}>{t('paymentPlans')}</NavLink>
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{t('admin')}</p>
          <div className="space-y-1">
            <NavLink to="/settings" className={linkClass}>{t('settings')}</NavLink>
          </div>
        </div>
      </nav>

      <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/20 to-indigo-500/10 p-4 text-sm text-slate-200">
        <p className="font-semibold text-white">{t('quickAccess')}</p>
        <p className="mt-2 leading-6 text-slate-300">{t('overview')}</p>
      </div>
    </aside>
  );
}

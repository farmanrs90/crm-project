
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition ${isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;

export default function Navbar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/85 text-slate-900 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Production CRM</p>
          <h3 className="text-lg font-semibold leading-tight">Admin Dashboard</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:block">
            Connected
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-slate-200 px-4 py-3 md:hidden">
        <NavLink to="/dashboard" className={mobileLinkClass}>Dashboard</NavLink>
        <NavLink to="/leads" className={mobileLinkClass}>Leads</NavLink>
        <NavLink to="/students" className={mobileLinkClass}>Students</NavLink>
        <NavLink to="/courses" className={mobileLinkClass}>Courses</NavLink>
        <NavLink to="/settings" className={mobileLinkClass}>Settings</NavLink>
      </nav>
    </header>
  );
}

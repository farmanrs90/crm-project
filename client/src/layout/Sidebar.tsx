import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-slate-800 font-semibold text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`;

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200/80 bg-slate-950 px-4 py-5 text-slate-100 shadow-[10px_0_40px_rgba(15,23,42,0.12)] md:block">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">CRM System</p>
        <h2 className="mt-2 text-2xl font-bold tracking-wide text-white">Growth Hub</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Manage leads, students, courses and daily operations in one place.
        </p>
      </div>

      <nav className="mt-6 space-y-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/leads" className={linkClass}>Leads</NavLink>
        <NavLink to="/students" className={linkClass}>Students</NavLink>
        <NavLink to="/courses" className={linkClass}>Courses</NavLink>
        <NavLink to="/settings" className={linkClass}>Settings</NavLink>
      </nav>

      <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/20 to-indigo-500/10 p-4 text-sm text-slate-200">
        <p className="font-semibold text-white">Today</p>
        <p className="mt-2 leading-6 text-slate-300">Track pipeline activity and keep your team aligned.</p>
      </div>
    </aside>
  );
}

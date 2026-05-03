import useAuthStore from '../../store/authStore';

export default function SettingsPage() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Basic app and session settings</p>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Current token</p>
          <p className="break-all text-sm">{token || 'No token found'}</p>
        </div>
        <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

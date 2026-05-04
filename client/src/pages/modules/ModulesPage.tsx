const modules = [
  { name: 'Dashboard', endpoint: '/api/dashboard', uiPath: '/dashboard', status: 'Visible in UI' },
  { name: 'Auth', endpoint: '/api/auth', uiPath: '/login', status: 'Visible in UI' },
  { name: 'Courses', endpoint: '/api/courses', uiPath: '/courses', status: 'Visible in UI' },
  { name: 'Leads', endpoint: '/api/leads', uiPath: '/leads', status: 'Visible in UI' },
  { name: 'Students', endpoint: '/api/students', uiPath: '/students', status: 'Visible in UI' },
  { name: 'Groups', endpoint: '/api/groups', uiPath: 'No dedicated page yet', status: 'Backend only' },
  { name: 'Teachers', endpoint: '/api/teachers', uiPath: 'No dedicated page yet', status: 'Backend only' },
  { name: 'Users', endpoint: '/api/users', uiPath: 'No dedicated page yet', status: 'Backend only' },
  { name: 'Enrollments', endpoint: '/api/enrollments', uiPath: 'No dedicated page yet', status: 'Backend only' },
  { name: 'Payments', endpoint: '/api/payments', uiPath: 'No dedicated page yet', status: 'Backend only' },
  { name: 'Payment Plans', endpoint: '/api/payment-plans', uiPath: 'No dedicated page yet', status: 'Backend only' },
];

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">System Modules</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">All backend modules available in this CRM</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <div key={module.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{module.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{module.endpoint}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${module.status === 'Visible in UI' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {module.status}
              </span>
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-medium text-slate-900">UI</p>
              <p className="mt-1 break-all">{module.uiPath}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
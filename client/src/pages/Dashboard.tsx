export default function Dashboard() {
  const cards = [
    { label: 'Total Leads', value: '128' },
    { label: 'Active Students', value: '84' },
    { label: 'Courses', value: '12' },
    { label: 'Pending Tasks', value: '7' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your CRM activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>• New lead created: John Smith</p>
          <p>• Student enrollment updated</p>
          <p>• New course added: React Basics</p>
        </div>
      </div>
    </div>
  );
}

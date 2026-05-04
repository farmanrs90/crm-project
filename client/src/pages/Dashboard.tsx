import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, type DashboardSummary } from '../services/dashboardService';
import { getTranslation } from '../localization/translations';
import { useUiStore } from '../store/uiStore';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const language = useUiStore((s) => s.language);
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    void (async () => {
      try {
        const res = await dashboardService.getSummary();
        setSummary(res.data || null);
      } catch {
        setSummary(null);
      }
    })();
  }, []);

  const cards = [
    { label: t('totalLeads'), value: summary?.totals?.leads ?? 0, to: '/leads' },
    { label: t('activeStudents'), value: summary?.totals?.students ?? 0, to: '/students' },
    { label: t('coursesCount'), value: summary?.totals?.courses ?? 0, to: '/courses' },
    { label: t('pendingPayments'), value: summary?.totals?.paymentsPending ?? 0, to: '/payments' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('dashboard')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('overview')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-slate-500">{card.label}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</h2>
            <p className="mt-2 text-xs font-medium text-sky-700">{t('openDetails')}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('recentLeads')}</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            {(summary?.recent?.leads || []).map((lead) => (
              <Link key={lead._id} to="/leads" className="block rounded-lg border border-slate-100 px-3 py-2 hover:bg-slate-50">
                {lead.firstName} {lead.lastName} · {lead.status || 'Unknown'}
              </Link>
            ))}
            {!summary?.recent?.leads?.length && <p className="text-slate-500 dark:text-slate-400">{t('noRecentLeads')}</p>}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('recentPayments')}</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            {(summary?.recent?.payments || []).map((payment) => (
              <Link key={payment._id} to="/payments" className="block rounded-lg border border-slate-100 px-3 py-2 hover:bg-slate-50">
                Installment {payment.installmentNumber} · {payment.status || 'Unknown'} · {payment.amountPaid ?? 0}
              </Link>
            ))}
            {!summary?.recent?.payments?.length && <p className="text-slate-500 dark:text-slate-400">{t('noRecentPayments')}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>• New lead created: John Smith</p>
          <p>• Student enrollment updated</p>
          <p>• New course added: React Basics</p>
        </div>
      </div>
    </div>
  );
}

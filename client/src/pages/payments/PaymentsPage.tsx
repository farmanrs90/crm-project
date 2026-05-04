import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { paymentService, type PaymentPayload } from '../../services/paymentService';
import { getApiErrorMessage } from '../../utils/apiError';

type PaymentItem = PaymentPayload & { _id: string };

const formatValue = (value: unknown) => {
  if (!value) return '-';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && value && 'planType' in value) {
    return `${(value as { planType?: string }).planType || 'Payment Plan'}`;
  }
  return '-';
};

const formatDate = (value: unknown) => {
  if (!value) return '-';
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
};

export default function PaymentsPage() {
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentService.getAll();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setItems(data);
      setSelectedItem((current) => current || data[0] || null);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load payments'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="mt-2 text-sm text-slate-300">Open any row to see plan, installment and status details.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Records</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{items.length}</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pending</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{items.filter((item) => item.status === 'pending').length}</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Paid</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{items.filter((item) => item.status === 'paid').length}</h2>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 font-semibold text-slate-900">Payment List</div>
        {loading ? (
          <div className="p-4 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-4 py-3">Installment</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Method</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50" onClick={() => setSelectedItem(item)}>
                    <td className="px-4 py-3 font-medium text-slate-900">#{item.installmentNumber}</td>
                    <td className="px-4 py-3">{item.amountPaid}</td>
                    <td className="px-4 py-3">{item.status || '-'}</td>
                    <td className="px-4 py-3 capitalize">{item.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-sky-100 pb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Payment Details</h3>
              <p className="text-sm text-slate-600">Selected payment record</p>
            </div>
            <Link to="/payments" className="text-sm font-medium text-sky-700">Open payments page</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div><span className="text-xs uppercase text-slate-500">Payment Plan</span><p className="font-medium break-all">{formatValue(selectedItem.paymentPlan)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Installment</span><p className="font-medium">{selectedItem.installmentNumber}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Amount Paid</span><p className="font-medium">{selectedItem.amountPaid}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Due Date</span><p className="font-medium">{formatDate(selectedItem.dueDate)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Paid At</span><p className="font-medium">{formatDate(selectedItem.paidAt)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Status</span><p className="font-medium">{selectedItem.status || '-'}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Method</span><p className="font-medium capitalize">{selectedItem.method}</p></div>
            <div className="md:col-span-2"><span className="text-xs uppercase text-slate-500">Note</span><p className="font-medium">{selectedItem.note || '-'}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
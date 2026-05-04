import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { paymentPlanService, type PaymentPlanPayload } from '../../services/paymentPlanService';
import { getApiErrorMessage } from '../../utils/apiError';

type PaymentPlanItem = PaymentPlanPayload & { _id: string };

export default function PaymentPlansPage() {
  const [items, setItems] = useState<PaymentPlanItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PaymentPlanItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentPlanService.getAll();
      const data = res.data || [];
      setItems(data);
      setSelectedItem((current) => current || data[0] || null);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load payment plans'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Plans</h1>
        <p className="text-sm text-slate-500">View payment plan data and click a row for details</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 font-semibold text-slate-900">Payment Plan List</div>
        {loading ? (
          <div className="p-4 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr><th>Type</th><th>Total</th><th>Discount</th><th>Active</th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelectedItem(item)}>
                    <td>{item.planType}</td>
                    <td>{item.totalAmount}</td>
                    <td>{item.discountAmount ?? 0}</td>
                    <td>{item.isActive ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Payment Plan Details</h3>
              <p className="text-sm text-slate-600">Selected payment plan record</p>
            </div>
            <Link to="/payment-plans" className="text-sm font-medium text-sky-700">Open payment plans page</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div><span className="text-xs uppercase text-slate-500">Plan Type</span><p className="font-medium">{selectedItem.planType}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Total Amount</span><p className="font-medium">{selectedItem.totalAmount}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Discount</span><p className="font-medium">{selectedItem.discountAmount ?? 0}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Active</span><p className="font-medium">{selectedItem.isActive ? 'Yes' : 'No'}</p></div>
            <div className="md:col-span-2"><span className="text-xs uppercase text-slate-500">Note</span><p className="font-medium">{selectedItem.note || '-'}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
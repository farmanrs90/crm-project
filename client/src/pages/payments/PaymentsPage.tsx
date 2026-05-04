import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { paymentService, type PaymentPayload } from '../../services/paymentService';
import { paymentPlanService } from '../../services/paymentPlanService';
import { leadConversionService } from '../../services/leadConversionService';
import { getApiErrorMessage } from '../../utils/apiError';
import StudentContractModal from '../../components/StudentContractModal';

type PaymentItem = PaymentPayload & { _id: string };
type FilterStatus = 'all' | 'pending' | 'paid';

type PopulatedLead = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

type PopulatedPlan = {
  _id?: string;
  planType?: string;
  totalAmount?: number;
  discountAmount?: number;
};

type SelectOption = {
  _id: string;
  label: string;
};

const emptyForm: PaymentPayload = {
  lead: '',
  paymentPlan: '',
  installmentNumber: 1,
  amountPaid: 0,
  dueDate: '',
  paidAt: '',
  status: 'pending',
  note: '',
  method: 'cash',
};

const formatValue = (value: unknown) => {
  if (!value) return '-';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && value) {
    const record = value as { planType?: string; name?: string; firstName?: string; lastName?: string; email?: string };
    if (record.planType) return record.planType;
    if (record.name) return record.name;
    const fullName = `${record.firstName || ''} ${record.lastName || ''}`.trim();
    if (fullName) return fullName;
    if (record.email) return record.email;
  }
  return '-';
};

const formatDate = (value: unknown) => {
  if (!value) return '-';
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
};

const normalizeStatus = (value: unknown) => String(value || '').trim().toLowerCase();

const getObjectId = (value: unknown) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && '_id' in (value as Record<string, unknown>)) {
    return String((value as { _id?: string })._id || '');
  }
  return '';
};

const getLeadLabel = (lead: unknown) => {
  if (!lead) return '-';
  if (typeof lead === 'string') return lead;
  const item = lead as PopulatedLead;
  const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim();
  return fullName || item.email || item._id || '-';
};

const getRequiredTotal = (paymentPlan: unknown) => {
  if (!paymentPlan || typeof paymentPlan !== 'object') return 0;
  const plan = paymentPlan as PopulatedPlan;
  const total = Number(plan.totalAmount || 0);
  const discount = Number(plan.discountAmount || 0);
  return Math.max(0, total - discount);
};

export default function PaymentsPage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [plans, setPlans] = useState<SelectOption[]>([]);
  const [leads, setLeads] = useState<SelectOption[]>([]);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [form, setForm] = useState<PaymentPayload>(emptyForm);
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const leadFromQuery = searchParams.get('lead') || '';
  
  // Contract Modal State
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractModalData, setContractModalData] = useState<{
    leadId: string;
    leadName: string;
    leadEmail: string;
    courseName: string;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);
  const [contractLoading, setContractLoading] = useState(false);

  const pendingCount = items.filter((item) => normalizeStatus(item.status) === 'pending').length;
  const paidCount = items.filter((item) => normalizeStatus(item.status) === 'paid').length;
  const filteredItems = items.filter((item) => {
    if (statusFilter === 'all') return true;
    return normalizeStatus(item.status) === statusFilter;
  });
  const waitingLeads = Array.from(new Set(
    filteredItems
      .map((item) => getLeadLabel(item.lead))
      .filter((label) => label !== '-')
  ));

  const handleChange = (field: keyof PaymentPayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => setForm({ ...emptyForm, lead: leadFromQuery });

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const [paymentsRes, plansRes, leadsRes] = await Promise.all([
        paymentService.getAll(),
        paymentPlanService.getAll(),
        api.get('/leads'),
      ]);
      const data = Array.isArray(paymentsRes.data) ? paymentsRes.data : paymentsRes.data?.data || [];
      setItems(data);
      setPlans((plansRes.data || []).map((plan: { _id: string; planType?: string }) => ({
        _id: plan._id,
        label: plan.planType || plan._id,
      })));
      setLeads((leadsRes.data || [])
        .filter((lead: { status?: string }) => lead.status === 'Accepted')
        .map((lead: { _id: string; firstName?: string; lastName?: string; email?: string }) => ({
          _id: lead._id,
          label: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.email || lead._id,
        })));
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

  useEffect(() => {
    if (leadFromQuery) {
      setForm((prev) => ({ ...prev, lead: leadFromQuery }));
    }
  }, [leadFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: PaymentPayload = {
        ...form,
        lead: form.lead || undefined,
        paymentPlan: form.paymentPlan,
        installmentNumber: Number(form.installmentNumber),
        amountPaid: Number(form.amountPaid),
        paidAt: form.paidAt || undefined,
      };

      // If payment status is 'paid', show contract before creating payment
      if (payload.status === 'paid' && payload.lead && payload.paymentPlan) {
        // Find lead and plan details
        const selectedLead = leads.find((l) => l._id === payload.lead);
        const selectedPlan = plans.find((p) => p._id === payload.paymentPlan);

        if (selectedLead && selectedPlan) {
          // Get full lead data
          const leadRes = await api.get(`/leads/${payload.lead}`);
          const leadData = leadRes.data;
          const planRes = await api.get(`/payment-plans/${payload.paymentPlan}`);
          const planData = planRes.data;

          setContractModalData({
            leadId: payload.lead,
            leadName: selectedLead.label,
            leadEmail: leadData?.email || '',
            courseName: leadData?.courseInterested || 'Seçilmiş',
            totalAmount: planData?.totalAmount || 0,
            discountAmount: planData?.discountAmount || 0,
            finalAmount: (planData?.totalAmount || 0) - (planData?.discountAmount || 0),
          });
          setShowContractModal(true);
          return; // Don't create payment yet
        }
      }

      // Otherwise, create payment normally
      await paymentService.create(payload);
      resetForm();
      await loadPayments();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to save payment'));
    }
  };

  const handleContractAccept = async () => {
    if (!contractModalData) return;
    setContractLoading(true);
    try {
      // Create payment
      const payload: PaymentPayload = {
        ...form,
        lead: form.lead || undefined,
        paymentPlan: form.paymentPlan,
        installmentNumber: Number(form.installmentNumber),
        amountPaid: Number(form.amountPaid),
        paidAt: form.paidAt || new Date().toISOString().split('T')[0],
      };
      await paymentService.create(payload);

      // Convert lead to student
      await leadConversionService.convertToStudent({
        leadId: contractModalData.leadId,
      });

      setShowContractModal(false);
      setContractModalData(null);
      resetForm();
      await loadPayments();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to process contract'));
    } finally {
      setContractLoading(false);
    }
  };

  const handleContractReject = () => {
    setShowContractModal(false);
    setContractModalData(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="mt-2 text-sm text-slate-300">Open any row to see plan, installment and status details.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <button type="button" onClick={() => setStatusFilter('all')} className={`rounded-xl border p-4 text-left shadow-sm ${statusFilter === 'all' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white'}`}>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Records</p>
          <h2 className={`mt-2 text-3xl font-semibold ${statusFilter === 'all' ? 'text-white' : 'text-slate-900'}`}>{items.length}</h2>
        </button>
        <button type="button" onClick={() => setStatusFilter('pending')} className={`rounded-xl border p-4 text-left shadow-sm ${statusFilter === 'pending' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}`}>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pending</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{pendingCount}</h2>
        </button>
        <button type="button" onClick={() => setStatusFilter('paid')} className={`rounded-xl border p-4 text-left shadow-sm ${statusFilter === 'paid' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Paid</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{paidCount}</h2>
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">
          {statusFilter === 'all' ? 'Butun odeme qeydlari' : statusFilter === 'pending' ? 'Pending olanlar (gozleyenler)' : 'Paid olanlar'}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {waitingLeads.length > 0
            ? waitingLeads.join(', ')
            : filteredItems.length > 0
              ? 'Qeydler var, amma bu odemeler lead-e baglanmayib.'
              : 'Secilen status ucun qeyd tapilmadi.'}
        </p>
      </div>

      {/* Contract Modal */}
      {showContractModal && contractModalData && (
        <StudentContractModal
          leadName={contractModalData.leadName}
          leadEmail={contractModalData.leadEmail}
          courseName={contractModalData.courseName}
          totalAmount={contractModalData.totalAmount}
          discountAmount={contractModalData.discountAmount}
          finalAmount={contractModalData.finalAmount}
          isLoading={contractLoading}
          onAccept={handleContractAccept}
          onReject={handleContractReject}
        />
      )}

      {/* Payment Form - More Clear */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Step 1: Select Lead */}
        <div className="border-b border-slate-100 p-4">
          <h3 className="font-semibold text-slate-900 mb-3">Step 1: Select Student</h3>
          <select 
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" 
            value={form.lead || ''} 
            onChange={(e) => handleChange('lead', e.target.value)}
            required
          >
            <option value="">Choose accepted lead/student...</option>
            {leads.map((lead) => (
              <option key={lead._id} value={lead._id}>{lead.label}</option>
            ))}
          </select>
        </div>

        {/* Step 2: Select Payment Plan & Show Pricing */}
        {form.lead && (
          <div className="border-b border-slate-100 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Step 2: Select Payment Plan & Amount</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <select 
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" 
                value={form.paymentPlan} 
                onChange={(e) => handleChange('paymentPlan', e.target.value)}
                required
              >
                <option value="">Choose payment plan...</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.label}</option>
                ))}
              </select>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amount to Pay</label>
                <input 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  placeholder="0.00"
                  value={form.amountPaid || ''} 
                  onChange={(e) => handleChange('amountPaid', Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Show Plan Pricing Info */}
            {form.paymentPlan && (
              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
                {plans.find(p => p._id === form.paymentPlan) && (
                  <>
                    <p className="text-sm text-blue-900">📋 <span className="font-semibold">{plans.find(p => p._id === form.paymentPlan)?.label}</span></p>
                    <p className="text-xs text-blue-700 mt-2">Tap "Mark as Paid" below to see full contract and pricing details before confirmation.</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Payment Details */}
        {form.lead && form.paymentPlan && (
          <div className="border-b border-slate-100 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Step 3: Payment Details</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Installment #</label>
                <input 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" 
                  type="number" 
                  min="1" 
                  value={form.installmentNumber} 
                  onChange={(e) => handleChange('installmentNumber', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  value={form.method} 
                  onChange={(e) => handleChange('method', e.target.value)}
                >
                  <option value="cash">💵 Cash</option>
                  <option value="credit_card">💳 Credit Card</option>
                  <option value="bank_transfer">🏦 Bank Transfer</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
                <input 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" 
                  type="date" 
                  value={form.dueDate} 
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  value={form.status || 'pending'} 
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="paid">✅ Paid</option>
                  <option value="overdue">⚠️ Overdue</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
            </div>

            {form.status === 'paid' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 mt-3">Paid Date</label>
                <input 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" 
                  type="date" 
                  value={form.paidAt || ''} 
                  onChange={(e) => handleChange('paidAt', e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 mt-3">Notes</label>
              <textarea 
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 min-h-20" 
                placeholder="Add any additional notes..." 
                value={form.note || ''} 
                onChange={(e) => handleChange('note', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Form Actions */}
        {error && (
          <div className="border-t border-slate-100 bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm font-semibold text-red-900">❌ Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-2 p-4 border-t border-slate-100">
          {form.lead && form.paymentPlan && form.amountPaid && form.status === 'paid' ? (
            <>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-emerald-600 text-white font-semibold py-2 hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? '⏳ Processing...' : '✅ View Contract & Confirm Payment'}
              </button>
              <button 
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ✕ Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                type="submit"
                disabled={loading || !form.lead || !form.paymentPlan || !form.amountPaid}
                className="flex-1 rounded-lg bg-slate-600 text-white font-semibold py-2 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Saving...' : '💾 Save Payment Record'}
              </button>
              <button 
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear Form
              </button>
            </>
          )}
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 font-semibold text-slate-900">Payment List</div>
        {loading ? (
          <div className="p-4 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Installment</th>
                  <th className="px-4 py-3">Required</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Remaining</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const requiredTotal = getRequiredTotal(item.paymentPlan);
                  const remaining = Math.max(0, requiredTotal - Number(item.amountPaid || 0));
                  return (
                  <tr key={item._id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50" onClick={() => setSelectedItem(item)}>
                    <td className="px-4 py-3 font-medium text-slate-900">{getLeadLabel(item.lead) === '-' ? 'No linked lead' : getLeadLabel(item.lead)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">#{item.installmentNumber}</td>
                    <td className="px-4 py-3">{requiredTotal}</td>
                    <td className="px-4 py-3">{item.amountPaid}</td>
                    <td className="px-4 py-3">{remaining}</td>
                    <td className="px-4 py-3">{item.status || '-'}</td>
                    <td className="px-4 py-3 capitalize">{item.method}</td>
                  </tr>
                )})}
                {!filteredItems.length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">Bu status ucun qeyd yoxdur.</td>
                  </tr>
                )}
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
          {(() => {
            const requiredTotal = getRequiredTotal(selectedItem.paymentPlan);
            const remaining = Math.max(0, requiredTotal - Number(selectedItem.amountPaid || 0));
            return (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div><span className="text-xs uppercase text-slate-500">Lead</span><p className="font-medium break-all">{getLeadLabel(selectedItem.lead)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Payment Plan</span><p className="font-medium break-all">{formatValue(selectedItem.paymentPlan)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Installment</span><p className="font-medium">{selectedItem.installmentNumber}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Required Total</span><p className="font-medium">{requiredTotal}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Amount Paid</span><p className="font-medium">{selectedItem.amountPaid}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Remaining Amount</span><p className="font-medium">{remaining}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Due Date</span><p className="font-medium">{formatDate(selectedItem.dueDate)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Paid At</span><p className="font-medium">{formatDate(selectedItem.paidAt)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Status</span><p className="font-medium">{selectedItem.status || '-'}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Method</span><p className="font-medium capitalize">{selectedItem.method}</p></div>
            <div className="md:col-span-2"><span className="text-xs uppercase text-slate-500">Note</span><p className="font-medium">{selectedItem.note || '-'}</p></div>
          </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
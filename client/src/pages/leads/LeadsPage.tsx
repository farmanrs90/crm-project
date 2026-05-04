import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leadService, type LeadPayload } from '../../services/leadService';
import { getApiErrorMessage } from '../../utils/apiError';

type LeadItem = LeadPayload & { _id: string };

const emptyForm: LeadPayload = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  source: 'Website',
  status: 'New',
  courseInterested: '',
  assignedTo: '',
  utmSource: '',
  notes: '',
};

export default function LeadsPage() {
  const [items, setItems] = useState<LeadItem[]>([]);
  const [form, setForm] = useState<LeadPayload>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<LeadItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
   const loadLeads = async () => {
   setLoading(true);
   setError(null);
   try {
     const res = await leadService.getAll();
     setItems(res.data || []);
   } catch (err: unknown) {
     setError(getApiErrorMessage(err, 'Failed to load leads'));
   } finally {
     setLoading(false);
   }
 };
  useEffect(() => {   
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await leadService.getAll();
        setItems(res.data || []);
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Failed to load leads'));
      } finally {
        setLoading(false);
      }
    })();
    }, []);

  const handleChange = (field: keyof LeadPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSelect = (item: LeadItem) => {
    setSelectedItem(item);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        await leadService.update(editId, form);
      } else {
        await leadService.create(form);
      }
      resetForm();
      await loadLeads();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to save lead'));
    }
  };

  const handleEdit = (item: LeadItem) => {
    setEditId(item._id);
    setSelectedItem(item);
    setForm({
      firstName: item.firstName,
      lastName: item.lastName,
      phone: item.phone,
      email: item.email,
      source: item.source,
      status: item.status,
      courseInterested: item.courseInterested as string || '',
      assignedTo: item.assignedTo as string || '',
      utmSource: item.utmSource || '',
      notes: item.notes || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await leadService.remove(id);
      await loadLeads();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to delete lead'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="text-sm text-slate-500">Manage lead pipeline</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-2">
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="First name" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Last name" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
        <select className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" value={form.source} onChange={(e) => handleChange('source', e.target.value)}>
          <option>Website</option><option>Referral</option><option>Social Media</option><option>Other</option>
        </select>
        <select className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
          <option>New</option><option>Contacted</option><option>Qualified</option><option>Lost</option><option>Accepted</option>
        </select>
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Course Interested (id)" value={form.courseInterested || ''} onChange={(e) => handleChange('courseInterested', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Assigned To (id)" value={form.assignedTo || ''} onChange={(e) => handleChange('assignedTo', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="UTM Source" value={form.utmSource || ''} onChange={(e) => handleChange('utmSource', e.target.value)} />
        <textarea className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 lg:col-span-2" placeholder="Notes" value={form.notes || ''} onChange={(e) => handleChange('notes', e.target.value)} />
        {error && <div className="text-sm text-error lg:col-span-2">{error}</div>}
        <div className="flex gap-2 lg:col-span-2">
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">{editId ? 'Update Lead' : 'Add Lead'}</button>
          <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Clear</button>
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 font-semibold text-slate-900">Lead List</div>
        {loading ? (
          <div className="p-4 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr><th>Name</th><th>Phone</th><th>Email</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="cursor-pointer hover:bg-slate-50" onClick={() => handleSelect(item)}>
                    <td>{item.firstName} {item.lastName}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>{item.status}</td>
                    <td className="flex gap-2">
                      <button className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50" onClick={(e) => { e.stopPropagation(); handleEdit(item); }}>Edit</button>
                      <button className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}>Delete</button>
                    </td>
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
              <h3 className="text-lg font-semibold text-slate-900">Lead Details</h3>
              <p className="text-sm text-slate-600">Click a row to inspect the lead</p>
            </div>
            <Link to="/leads" className="text-sm font-medium text-sky-700">Open leads page</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div><span className="text-xs uppercase text-slate-500">Name</span><p className="font-medium">{selectedItem.firstName} {selectedItem.lastName}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Phone</span><p className="font-medium">{selectedItem.phone}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Email</span><p className="font-medium">{selectedItem.email}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Status</span><p className="font-medium">{selectedItem.status}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Source</span><p className="font-medium">{selectedItem.source}</p></div>
            <div><span className="text-xs uppercase text-slate-500">UTM Source</span><p className="font-medium">{selectedItem.utmSource || '-'}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Course Interested</span><p className="font-medium break-all">{selectedItem.courseInterested || '-'}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Assigned To</span><p className="font-medium break-all">{selectedItem.assignedTo || '-'}</p></div>
            <div className="md:col-span-2"><span className="text-xs uppercase text-slate-500">Notes</span><p className="font-medium">{selectedItem.notes || '-'}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}

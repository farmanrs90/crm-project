import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentService, type StudentPayload } from '../../services/studentService';
import { getApiErrorMessage } from '../../utils/apiError';

type StudentItem = StudentPayload & { _id: string };

const emptyForm: StudentPayload = {
  user: '',
  lead: '',
  studentCode: '',
  enrollmentDate: '',
  status: 'active',
};

export default function StudentsPage() {
  const [items, setItems] = useState<StudentItem[]>([]);
  const [form, setForm] = useState<StudentPayload>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<StudentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentService.getAll();
      setItems(res.data || []);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load students'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (field: keyof StudentPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSelect = (item: StudentItem) => {
    setSelectedItem(item);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        await studentService.update(editId, form);
      } else {
        await studentService.create(form);
      }
      resetForm();
      await loadStudents();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to save student'));
    }
  };

  const handleEdit = (item: StudentItem) => {
    setEditId(item._id);
    setSelectedItem(item);
    setForm({
      user: item.user,
      lead: item.lead,
      studentCode: item.studentCode,
      enrollmentDate: item.enrollmentDate,
      status: item.status,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await studentService.remove(id);
      await loadStudents();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to delete student'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-sm text-slate-500">Manage students connected to leads</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-2">
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="User ID" value={form.user} onChange={(e) => handleChange('user', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Lead ID" value={form.lead} onChange={(e) => handleChange('lead', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Student Code" value={form.studentCode} onChange={(e) => handleChange('studentCode', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" type="date" value={form.enrollmentDate || ''} onChange={(e) => handleChange('enrollmentDate', e.target.value)} />
        <select className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
          <option>active</option><option>inactive</option><option>graduated</option><option>dropped</option>
        </select>
        {error && <div className="text-sm text-error lg:col-span-2">{error}</div>}
        <div className="flex gap-2 lg:col-span-2">
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">{editId ? 'Update Student' : 'Add Student'}</button>
          <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Clear</button>
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 font-semibold text-slate-900">Student List</div>
        {loading ? (
          <div className="p-4 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr><th>Code</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="cursor-pointer hover:bg-slate-50" onClick={() => handleSelect(item)}>
                    <td>{item.studentCode}</td>
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
              <h3 className="text-lg font-semibold text-slate-900">Student Details</h3>
              <p className="text-sm text-slate-600">Click a row to inspect the student</p>
            </div>
            <Link to="/students" className="text-sm font-medium text-sky-700">Open students page</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div><span className="text-xs uppercase text-slate-500">Student Code</span><p className="font-medium">{selectedItem.studentCode}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Status</span><p className="font-medium">{selectedItem.status}</p></div>
            <div><span className="text-xs uppercase text-slate-500">User</span><p className="font-medium break-all">{selectedItem.user || '-'}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Lead</span><p className="font-medium break-all">{selectedItem.lead || '-'}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Enrollment Date</span><p className="font-medium">{selectedItem.enrollmentDate || '-'}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { courseService, type CoursePayload } from '../../services/courseService';
import { getApiErrorMessage } from '../../utils/apiError';

type CourseItem = CoursePayload & { _id: string };

const emptyForm: CoursePayload = {
  name: '',
  category: '',
  durationMonths: 3,
  price: 0,
  description: '',
  isActive: true,
  syllabus: '',
};

export default function CoursesPage() {
  const [items, setItems] = useState<CourseItem[]>([]);
  const [form, setForm] = useState<CoursePayload>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseService.getAll();
      setItems(res.data || []);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load courses'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (field: keyof CoursePayload, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...form,
        durationMonths: Number(form.durationMonths),
        price: Number(form.price),
      };

      if (editId) {
        await courseService.update(editId, payload);
      } else {
        await courseService.create(payload);
      }
      resetForm();
      await loadCourses();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to save course'));
    }
  };

  const handleEdit = (item: CourseItem) => {
    setEditId(item._id);
    setForm({
      name: item.name,
      category: item.category,
      durationMonths: item.durationMonths,
      price: item.price,
      description: item.description,
      isActive: item.isActive,
      syllabus: item.syllabus,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await courseService.remove(id);
      await loadCourses();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to delete course'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
        <p className="text-sm text-slate-500">Manage course catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-2">
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Category ID" value={form.category || ''} onChange={(e) => handleChange('category', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" type="number" min="1" placeholder="Duration Months" value={form.durationMonths ?? ''} onChange={(e) => handleChange('durationMonths', Number(e.target.value))} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value))} />
        <textarea className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 lg:col-span-2" placeholder="Description" value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" placeholder="Syllabus URL/Text" value={form.syllabus || ''} onChange={(e) => handleChange('syllabus', e.target.value)} />
        <label className="flex items-center gap-2 lg:col-span-2">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300" checked={!!form.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} />
          Active
        </label>
        {error && <div className="text-sm text-error lg:col-span-2">{error}</div>}
        <div className="flex gap-2 lg:col-span-2">
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">{editId ? 'Update Course' : 'Add Course'}</button>
          <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Clear</button>
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 font-semibold text-slate-900">Course List</div>
        {loading ? (
          <div className="p-4 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr><th>Name</th><th>Price</th><th>Active</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.isActive ? 'Yes' : 'No'}</td>
                    <td className="flex gap-2">
                      <button className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50" onClick={() => handleEdit(item)}>Edit</button>
                      <button className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500" onClick={() => handleDelete(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

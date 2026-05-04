import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { groupService, type GroupPayload } from '../../services/groupService';
import { getApiErrorMessage } from '../../utils/apiError';

type GroupItem = GroupPayload & { _id: string };

const getLabel = (value: unknown) => {
  if (!value) return '-';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    const record = value as { name?: string; firstName?: string; lastName?: string };
    if (record.name) return record.name;
    return `${record.firstName || ''} ${record.lastName || ''}`.trim() || '-';
  }
  return '-';
};

const formatDate = (value: unknown) => {
  if (!value) return '-';
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
};

export default function GroupsPage() {
  const [items, setItems] = useState<GroupItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GroupItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await groupService.getAll();
      const data = res.data || [];
      setItems(data);
      setSelectedItem((current) => current || data[0] || null);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load groups'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
        <p className="mt-2 text-sm text-slate-300">View class groups and open a row to inspect its full record.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Groups</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{items.length}</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{items.filter((item) => item.isActive).length}</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Inactive</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{items.filter((item) => !item.isActive).length}</h2>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 font-semibold text-slate-900">Group List</div>
        {loading ? (
          <div className="p-4 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Active</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50" onClick={() => setSelectedItem(item)}>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3">{item.capacity}</td>
                    <td className="px-4 py-3">{item.isActive ? 'Yes' : 'No'}</td>
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
              <h3 className="text-lg font-semibold text-slate-900">Group Details</h3>
              <p className="text-sm text-slate-600">Selected group record</p>
            </div>
            <Link to="/groups" className="text-sm font-medium text-sky-700">Open groups page</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div><span className="text-xs uppercase text-slate-500">Name</span><p className="font-medium">{selectedItem.name}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Capacity</span><p className="font-medium">{selectedItem.capacity}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Course</span><p className="font-medium break-all">{getLabel(selectedItem.course)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Teacher</span><p className="font-medium break-all">{getLabel(selectedItem.teacher)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Start Date</span><p className="font-medium">{formatDate(selectedItem.startDate)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">End Date</span><p className="font-medium">{formatDate(selectedItem.endDate)}</p></div>
            <div><span className="text-xs uppercase text-slate-500">Active</span><p className="font-medium">{selectedItem.isActive ? 'Yes' : 'No'}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
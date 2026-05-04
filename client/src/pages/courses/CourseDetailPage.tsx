import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { courseService, type CoursePayload } from '../../services/courseService';
import { getApiErrorMessage } from '../../utils/apiError';

type CourseItem = CoursePayload & { _id: string };

const formatDate = (value: unknown) => {
  if (!value) return '-';
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await courseService.getById(id);
        setCourse(res.data || res.data?.data || null);
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Failed to load course details'));
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading course...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  if (!course) {
    return <div className="p-6 text-sm text-slate-600">Course not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-indigo-600 to-slate-900 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-100">Course Profile</p>
            <h1 className="mt-2 text-3xl font-bold">{course.name}</h1>
            <p className="mt-2 text-sm text-indigo-100">Course detail page with pricing and duration.</p>
          </div>
          <Link to="/courses" className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">
            ← Back to Courses
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Price</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{course.price}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Duration</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{course.durationMonths || '-'} mo</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{course.isActive ? 'Active' : 'Inactive'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 break-all">{course.category || '-'}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Description</p>
            <p className="mt-2 text-sm text-slate-700">{course.description || '-'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Syllabus</p>
            <p className="mt-2 text-sm text-slate-700 break-words">{course.syllabus || '-'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Created</p>
            <p className="mt-2 text-sm text-slate-700">{formatDate((course as { createdAt?: unknown }).createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Course ID</p>
            <p className="mt-2 text-sm text-slate-700 break-all">{course._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

interface StudentData {
  _id: string;
  studentCode: string;
  lead?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  enrollmentDate: string;
  status: string;
}

interface Enrollment {
  _id: string;
  group?: {
    _id: string;
    code: string;
    startDate: string;
    endDate: string;
  };
  course?: {
    _id: string;
    name: string;
    durationMonths: number;
  };
  startDate: string;
  endDate: string;
  finalGrade?: number;
  status: string;
}

interface Payment {
  _id: string;
  paymentPlan?: {
    totalAmount: number;
    discountAmount: number;
  };
  amountPaid: number;
  dueDate: string;
  paidAt?: string;
  status: string;
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [studentRes, enrollmentRes, paymentRes] = await Promise.all([
          api.get(`/students/${id}`),
          api.get(`/enrollments?studentId=${id}`),
          api.get(`/payments?studentId=${id}`),
        ]);

        setStudent(studentRes.data);
        setEnrollments(enrollmentRes.data || []);
        setPayments(paymentRes.data || []);
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Failed to load student details'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!student) {
    return <div className="p-6">Student not found</div>;
  }

  const totalPaymentRequired = payments.reduce(
    (sum, p) => sum + ((p.paymentPlan?.totalAmount || 0) - (p.paymentPlan?.discountAmount || 0)),
    0
  );
  const totalPaid = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  const totalDue = totalPaymentRequired - totalPaid;

  const activeEnrollments = enrollments.filter(e => e.status === 'active' || e.status === 'Active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed' || e.status === 'Completed');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {student.lead?.firstName} {student.lead?.lastName}
          </h1>
          <p className="mt-1 text-sm text-slate-600">Şagird Kodu: {student.studentCode}</p>
        </div>
        <Link to="/students" className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300">
          ← Geri
        </Link>
      </div>

      {/* Status & Contact */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
          <p className="mt-2 text-lg font-bold text-slate-900 capitalize">{student.status}</p>
          <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            student.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
          }`}>
            {student.status === 'active' ? '✅ Aktiv' : student.status === 'graduated' ? '🎓 Məzun' : '❌ Qeyd edilməmiş'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
          <p className="mt-2 break-all font-medium text-slate-900">{student.lead?.email || '-'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase">Telefon</p>
          <p className="mt-2 font-medium text-slate-900">{student.lead?.phone || '-'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase">Qeydiyyat Tarixi</p>
          <p className="mt-2 font-medium text-slate-900">
            {new Date(student.enrollmentDate).toLocaleDateString('az-AZ')}
          </p>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border-l-4 border-l-blue-500 bg-blue-50 p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase">Cəmi Məbləğ</p>
          <p className="mt-2 text-2xl font-bold text-blue-900">${totalPaymentRequired.toFixed(2)}</p>
        </div>

        <div className="rounded-xl border-l-4 border-l-emerald-500 bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Ödəniş Edilmiş</p>
          <p className="mt-2 text-2xl font-bold text-emerald-900">${totalPaid.toFixed(2)}</p>
          <p className="mt-1 text-sm text-emerald-700">{((totalPaid / totalPaymentRequired) * 100 || 0).toFixed(0)}% Tamamlandı</p>
        </div>

        <div className={`rounded-xl border-l-4 p-4 ${
          totalDue === 0
            ? 'border-l-emerald-500 bg-emerald-50'
            : totalDue > 0
            ? 'border-l-red-500 bg-red-50'
            : 'border-l-blue-500 bg-blue-50'
        }`}>
          <p className={`text-xs font-semibold uppercase ${
            totalDue === 0 ? 'text-emerald-600' : totalDue > 0 ? 'text-red-600' : 'text-blue-600'
          }`}>
            {totalDue === 0 ? 'Borcunuz Yoxdur ✅' : totalDue > 0 ? 'Qalan Borç' : 'Artıq Ödənmiş'}
          </p>
          <p className={`mt-2 text-2xl font-bold ${
            totalDue === 0 ? 'text-emerald-900' : totalDue > 0 ? 'text-red-900' : 'text-blue-900'
          }`}>
            ${Math.abs(totalDue).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Active Enrollments */}
      {activeEnrollments.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">📚 Fəal Kurslar</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeEnrollments.map((enrollment) => (
              <div key={enrollment._id} className="rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50">
                <h3 className="font-bold text-slate-900">{enrollment.course?.name || 'Kurs'}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  📅 {new Date(enrollment.startDate).toLocaleDateString('az-AZ')} - {new Date(enrollment.endDate).toLocaleDateString('az-AZ')}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ 
                        width: `${Math.min(100, Math.max(0, ((new Date().getTime() - new Date(enrollment.startDate).getTime()) / (new Date(enrollment.endDate).getTime() - new Date(enrollment.startDate).getTime())) * 100))}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {Math.round(Math.max(0, Math.min(100, ((new Date().getTime() - new Date(enrollment.startDate).getTime()) / (new Date(enrollment.endDate).getTime() - new Date(enrollment.startDate).getTime())) * 100)))}%
                  </span>
                </div>
                {enrollment.group && (
                  <p className="text-sm text-slate-600 mt-2">Qrup: <strong>{enrollment.group.code}</strong></p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Enrollments */}
      {completedEnrollments.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">🎓 Tamamlanan Kurslar</h2>
          <div className="space-y-3">
            {completedEnrollments.map((enrollment) => (
              <div key={enrollment._id} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-b-0">
                <div>
                  <h3 className="font-semibold text-slate-900">{enrollment.course?.name}</h3>
                  <p className="text-sm text-slate-600">
                    {new Date(enrollment.startDate).toLocaleDateString('az-AZ')} - {new Date(enrollment.endDate).toLocaleDateString('az-AZ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-600">Bal:</p>
                  <p className="text-lg font-bold text-emerald-600">{enrollment.finalGrade || '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">💳 Ödəniş Tarixi</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Məbləğ</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Vəd Tarixi</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Ödənmiş</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      ${((payment.paymentPlan?.totalAmount || 0) - (payment.paymentPlan?.discountAmount || 0)).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {payment.status === 'paid' ? '✅ Ödənmiş' : '⏳ Gözləyən'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(payment.dueDate).toLocaleDateString('az-AZ')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      ${(payment.amountPaid || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {enrollments.length === 0 && payments.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-slate-600">Bu şagird üçün hali-hazırda kurs və ya ödəniş qeydləri yoxdur.</p>
        </div>
      )}
    </div>
  );
}

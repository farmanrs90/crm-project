import { useEffect } from 'react';

interface LeadAcceptanceModalProps {
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  courseInterested: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LeadAcceptanceModal({
  leadName,
  leadEmail,
  leadPhone,
  courseInterested,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: LeadAcceptanceModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/20"></div>
              <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-white/20"></div>
            </div>
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-white"></span>
                <span className="text-xs font-semibold text-white">LEAD ACCEPTED</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Təbriklər! Lead Qəbul Edildi ✨
              </h2>
              <p className="mt-2 text-emerald-100">
                İndi bu müştəri üçün təhsil planı yaradın
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Lead Info Card */}
            <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Müştəri Adı
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{leadName}</p>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-2">
                    <svg
                      className="h-5 w-5 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {leadEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Telefon
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">{leadPhone}</p>
                  </div>
                </div>

                {courseInterested && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Maraq Duyduğu Kurs
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                      <span className="inline-block h-2 w-2 rounded-full bg-teal-500"></span>
                      {courseInterested}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-6 rounded-xl bg-blue-50 p-4 border border-blue-200">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500">
                  <span className="text-sm font-bold text-white">→</span>
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Sonraki Addım</p>
                  <p className="mt-1 text-sm text-blue-700">
                    Ödəniş Planını Yaradın və Müqavilə İmzalayın
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 rounded-lg border-2 border-slate-300 px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50"
              >
                Sonra Edəm
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Yönləndirmə...
                  </>
                ) : (
                  <>
                    <span>Ödənişə Keç</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-center text-xs text-slate-500">
              💡 Məsləhət: Ödəniş Planını yaradanda müştəri avtomatik olaraq qrupda qeydiyyatdan keçəcəkdir
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

import { useEffect } from 'react';

interface StudentContractModalProps {
  leadName: string;
  leadEmail: string;
  courseName: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  isOpen: boolean;
  isLoading?: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export default function StudentContractModal({
  leadName,
  leadEmail,
  courseName,
  totalAmount,
  discountAmount,
  finalAmount,
  isOpen,
  isLoading = false,
  onAccept,
  onReject,
}: StudentContractModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onReject();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onReject]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={() => !isLoading && onReject()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 border-b border-blue-700">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  📋 Təhsil Müqaviləsi
                </h2>
                <p className="mt-1 text-blue-100">
                  Zəhmət olmasa şərtləri yoxlayıb təsdiq edin
                </p>
              </div>
              <div className="text-4xl">📜</div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Contract Content */}
            <div className="space-y-4 bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-300">
              <div className="text-sm leading-relaxed text-slate-700 space-y-4">
                <div className="border-b border-slate-300 pb-4">
                  <h3 className="font-bold text-slate-900 mb-2">📋 MÜQAVILƏ ŞƏRTLƏRİ</h3>
                  <p className="text-justify">
                    Bu müqavilə <strong>{leadName}</strong> (Tələbə) ilə tədris müəssisəsi arasında bağlanmış olub. 
                    Tələbə <strong>{courseName}</strong> kursuna yazılmasını qəbul edir.
                  </p>
                </div>

                <div className="border-b border-slate-300 pb-4">
                  <h3 className="font-bold text-slate-900 mb-2">💰 ÖDƏNIŞ ŞƏRTLƏRI</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Əsas Qiymət:</span>
                      <span className="font-medium">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Endirim:</span>
                      <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-slate-300 pt-2 text-lg font-bold">
                      <span>Yekun Məbləğ:</span>
                      <span className="text-indigo-600">${finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm">
                    Tələbə ödənişi hissə-hissə (ay başında) və ya tam məbləği bir dəfədə edə biləcəkdir.
                  </p>
                </div>

                <div className="border-b border-slate-300 pb-4">
                  <h3 className="font-bold text-slate-900 mb-2">📚 KURS ŞƏRTLƏRI</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Kurs müddəti: Qeydiyyat tarixindən başlayaraq</li>
                    <li>Nəzarə işləri: Hər hafta təyin olunacaq</li>
                    <li>Yekun imtahan: Kurs sonunda</li>
                    <li>Keçmə nəticəsi: 60% və yuxarı bal</li>
                  </ul>
                </div>

                <div className="border-b border-slate-300 pb-4">
                  <h3 className="font-bold text-slate-900 mb-2">❌ İPTAL ŞƏRTLƏRI</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Kurs başlanmamışdırsa: 100% geri qaytarılma</li>
                    <li>1 həfta içində: 75% geri qaytarılma</li>
                    <li>2 həftə içində: 50% geri qaytarılma</li>
                    <li>2 həftədən sonra: Geri qaytarılma yoxdur</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>⚠️ Qeyd:</strong> Bu müqavilə bağlayaraq siz bütün şərtləri qəbul etmiş sayılırsınız. 
                    Zəhmət olmasa hər bir nöqtəni diqqətlə oxuyun.
                  </p>
                </div>
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
              <div>
                <p className="text-xs font-semibold text-indigo-700 uppercase">Tələbə Adı</p>
                <p className="mt-1 text-sm font-bold text-indigo-900">{leadName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-700 uppercase">Email</p>
                <p className="mt-1 text-sm font-bold text-indigo-900 break-all">{leadEmail}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold text-indigo-700 uppercase">Kurs</p>
                <p className="mt-1 text-sm font-bold text-indigo-900">{courseName}</p>
              </div>
            </div>

            {/* Signature */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-300">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase mb-3">Tələbə İmzası</p>
                <div className="border-b-2 border-slate-400 h-16 flex items-end justify-center pb-2">
                  <p className="text-xs text-slate-500">_{leadName}_</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase mb-3">Tarix</p>
                <div className="border-b-2 border-slate-400 h-16 flex items-end justify-center pb-2">
                  <p className="text-xs text-slate-500">{new Date().toLocaleDateString('az-AZ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 px-6 py-4 flex gap-3">
            <button
              onClick={onReject}
              disabled={isLoading}
              className="flex-1 rounded-lg border-2 border-slate-300 px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-100 disabled:opacity-50"
            >
              ❌ Rədd Edim
            </button>
            <button
              onClick={onAccept}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
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
                  Emal edilir...
                </>
              ) : (
                <>
                  <span>✅ Qəbul Edirəm</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

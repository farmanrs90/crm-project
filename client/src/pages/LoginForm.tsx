import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getTranslation, languageLabels } from '../localization/translations';
import { useUiStore } from '../store/uiStore';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const language = useUiStore((s) => s.language);
  const theme = useUiStore((s) => s.theme);
  const setLanguage = useUiStore((s) => s.setLanguage);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  const t = (key: string) => getTranslation(language, key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      const token = res?.data?.token;
      if (token) {
        navigate('/dashboard');
      } else {
        setError(language === 'en' ? 'Login failed: no token returned' : language === 'az' ? 'Giriş uğursuz oldu: token qaytarılmadı' : 'Ошибка входа: токен не был возвращен');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error?.response?.data?.message || error?.message || (language === 'en' ? 'Login error' : language === 'az' ? 'Giriş xətası' : 'Ошибка входа');
      setError(msg);
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/40 bg-white/80 shadow-[0_24px_100px_rgba(15,23,42,0.16)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden bg-slate-950 px-8 py-10 text-white sm:px-10 lg:px-12">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-sky-500/30 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={toggleTheme} className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10">
                {theme === 'dark' ? t('dark') : t('light')}
              </button>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'az' | 'ru')}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white outline-none"
              >
                {Object.entries(languageLabels).map(([code, label]) => (
                  <option key={code} value={code} className="text-slate-900">{label}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">{t('appName')}</p>
              <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">
                {language === 'en' && 'Manage your sales pipeline with clarity and speed.'}
                {language === 'az' && 'Satış prosesini aydın və sürətli şəkildə idarə et.'}
                {language === 'ru' && 'Управляйте воронкой продаж ясно и быстро.'}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                {language === 'en' && 'A clean workspace for leads, students, courses and daily operations. Built for fast teams and real growth.'}
                {language === 'az' && 'Müraciətlər, tələbələr, kurslar və gündəlik əməliyyatlar üçün səliqəli iş mühiti.'}
                {language === 'ru' && 'Удобное пространство для лидов, студентов, курсов и ежедневных операций.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [t('leads'), '128'],
                [t('students'), '84'],
                [t('courses'), '12'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto flex max-w-md flex-col justify-center">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{t('welcomeBack')}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">{t('signInTitle')}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {t('signInSubtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">{t('emailLabel')}</label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">{t('passwordLabel')}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? t('signingIn') : t('loginButton')}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{t('tipTitle')}</p>
              <p className="mt-2 leading-6">{t('tipText')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginForm;
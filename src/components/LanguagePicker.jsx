import { LANGUAGES, t } from '../i18n/strings';

export default function LanguagePicker({ onPick, lang }) {
  const indian = LANGUAGES;
  const global = [];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white font-bold text-lg mb-3">
            RR
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t(lang, 'appName')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t(lang, 'tagline')}</p>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-1">{t(lang, 'languagePickTitle')}</h2>
        <p className="text-sm text-slate-500 mb-6">{t(lang, 'languagePickSubtitle')}</p>

        <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
          {t(lang, 'indianLanguages')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {indian.map(l => (
            <button
              key={l.code}
              onClick={() => onPick(l.code)}
              className="p-3 rounded-xl border-2 border-teal-100 bg-teal-50/40 hover:border-teal-400 transition text-center"
            >
              <span className="block text-lg font-bold text-teal-700 mb-1 tracking-wider">
                {l.short}
              </span>
              <span className="text-sm font-medium text-slate-700">{l.label}</span>
            </button>
          ))}
        </div>

        {global.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {t(lang, 'globalLanguages')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {global.map(l => (
                <button
                  key={l.code}
                  onClick={() => onPick(l.code)}
                  className="p-3 rounded-xl border-2 border-slate-200 hover:border-teal-400 transition text-center"
                >
                  <span className="block text-lg font-bold text-slate-700 mb-1 tracking-wider">
                    {l.short}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{l.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
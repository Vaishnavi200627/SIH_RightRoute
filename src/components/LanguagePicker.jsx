import { Languages, Shield, Globe } from 'lucide-react';
import { LANGUAGES, t } from '../i18n/strings';

export default function LanguagePicker({ onPick, lang }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-teal-500/5 p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-xl mb-4 shadow-lg shadow-teal-500/30">
            RR
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {t(lang, 'appName')}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">{t(lang, 'tagline')}</p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-medium text-teal-700">
              <Shield className="w-3.5 h-3.5" />
              No data stored
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-medium text-teal-700">
              <Globe className="w-3.5 h-3.5" />
              Runs in your browser
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-medium text-teal-700">
              <Languages className="w-3.5 h-3.5" />
              5 Indian languages
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-teal-600 text-lg">🇮🇳</span>
          <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wider">
            {t(lang, 'languagePickTitle')}
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-5">{t(lang, 'languagePickSubtitle')}</p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => onPick(l.code)}
              className="group relative p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-0.5 transition-all duration-200 text-center overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="block text-lg font-bold bg-gradient-to-br from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-1 tracking-wider">
                {l.short}
              </span>
              <span className="text-sm font-medium text-slate-700">{l.label}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 text-center mt-6">
          {t(lang, 'languagePickSubtitle')}
        </p>
      </div>
    </div>
  );
}
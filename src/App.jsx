import { useState } from 'react';
import { Shield, Globe, Languages, Award } from 'lucide-react';
import { resolveRoute, RULESET_META } from './lib/engine';
import { ping } from './lib/analytics';
import { t } from './i18n/strings';
import LanguagePicker from './components/LanguagePicker';
import CrisisPicker from './components/CrisisPicker';
import IntakeFlow from './components/IntakeFlow';
import RouteResult from './components/RouteResult';
import Evidence from './components/Evidence';
import Dashboard from './components/Dashboard';

function Badge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-600">
      <Icon className="w-3 h-3 text-teal-600" />
      {label}
    </span>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [langChosen, setLangChosen] = useState(false);
  const [view, setView] = useState('navigator');
  const [category, setCategory] = useState(null);
  const [intake, setIntake] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  function pickLanguage(code) {
    setLang(code);
    setLangChosen(true);
  }

  function pickCategory(id) {
    setCategory(id);
    setIntake({ category: id });
    setResult(null);
  }

  function submitIntake() {
    setBusy(true);
    ping(category, lang);
    setTimeout(() => {
      setResult(resolveRoute(intake));
      setBusy(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  }

  function reset() {
    setCategory(null);
    setIntake({});
    setResult(null);
  }

  if (!langChosen) {
    return <LanguagePicker onPick={pickLanguage} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <button
            onClick={() => { setView('navigator'); reset(); }}
            className="flex items-center gap-3 text-left group"
          >
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
              RR
            </span>
            <span>
              <span className="block font-bold text-slate-900 leading-tight">
                {t(lang, 'appName')}
              </span>
              <span className="block text-[11px] text-slate-500 leading-tight">
                {t(lang, 'tagline')}
              </span>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === 'dashboard' ? 'navigator' : 'dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition"
            >
              <Award className="w-3.5 h-3.5" />
              {view === 'dashboard' ? 'Navigator' : t(lang, 'dashboard')}
            </button>
            <button
              onClick={() => { setLangChosen(false); setView('navigator'); reset(); }}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-semibold tracking-wide"
            >
              <Languages className="w-3.5 h-3.5" />
              {lang.toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {view === 'dashboard' ? (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge icon={Shield} label="No data stored" />
              <Badge icon={Globe} label="Runs in your browser" />
              <Badge icon={Languages} label="5 Indian languages" />
            </div>
            <Dashboard />
          </>
        ) : (
          <>
            {!category && !result && (
              <>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge icon={Shield} label="No data stored" />
                  <Badge icon={Globe} label="Runs in your browser" />
                  <Badge icon={Languages} label="5 Indian languages" />
                </div>
                <CrisisPicker onPick={pickCategory} lang={lang} selected={category} />
              </>
            )}

            {category && !result && !busy && (
              <IntakeFlow
                category={category}
                intake={intake}
                setIntake={setIntake}
                onSubmit={submitIntake}
                lang={lang}
              />
            )}

            {busy && (
              <div className="text-center py-20">
                <div
                  className="inline-block w-8 h-8 border-4 border-teal-100 border-t-teal-600 rounded-full"
                  style={{ animation: 'spin 0.7s linear infinite' }}
                />
                <p className="mt-4 text-sm text-slate-500">{t(lang, 'evaluating')}</p>
              </div>
            )}

            {result && (
              <>
                <RouteResult result={result} lang={lang} onRestart={reset} />
                <Evidence lang={lang} result={result} />
              </>
            )}
          </>
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-8 text-xs text-slate-400 text-center">
        {t(lang, 'footerVersion')}{RULESET_META.version} · {RULESET_META.jurisdiction} · {RULESET_META.lastReviewed}
      </footer>
    </div>
  );
}
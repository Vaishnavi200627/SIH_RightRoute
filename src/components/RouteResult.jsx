import { t } from '../i18n/strings';
import { tierLabel } from '../lib/engine';

const TIER_STYLES = {
  1: { bg: 'bg-rose-600', text: 'text-white', panel: 'bg-rose-50 border-rose-200' },
  2: { bg: 'bg-orange-600', text: 'text-white', panel: 'bg-orange-50 border-orange-200' },
  3: { bg: 'bg-purple-600', text: 'text-white', panel: 'bg-purple-50 border-purple-200' },
  4: { bg: 'bg-slate-700', text: 'text-white', panel: 'bg-slate-50 border-slate-200' }
};

function ModuleHeader({ index, title, tone = 'slate' }) {
  const toneMap = {
    teal: 'text-teal-700',
    slate: 'text-slate-700',
    rose: 'text-rose-700'
  };
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={`text-[10px] font-bold ${toneMap[tone]} bg-white border border-current rounded px-1.5 py-0.5`}>
        {index}
      </span>
      <h3 className={`text-xs font-bold uppercase tracking-wider ${toneMap[tone]}`}>
        {title}
      </h3>
    </div>
  );
}

export default function RouteResult({ result, lang, onRestart }) {
  if (!result) return null;

  const style = TIER_STYLES[result.tier] || TIER_STYLES[4];

  return (
    <section className="animate-fade-in space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header with tier badge */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${style.bg} ${style.text}`}>
              {tierLabel(result.tier)}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {result.ruleId}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{result.label}</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            priority {result.priority} · ruleset v{result.rulesetVersion} · {result.evaluated} rules evaluated
          </p>
        </div>

        {/* Module B — Why this route */}
        <div className={`p-6 border-b ${style.panel}`}>
          <ModuleHeader index="B" title={t(lang, 'whyTitle')} tone="teal" />
          <ul className="space-y-1.5 mb-4">
            {result.matchedOn.map((m, i) => (
              <li key={i} className="text-sm font-medium text-slate-800 flex gap-2">
                <span className="text-teal-600">✓</span>
                <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-teal-200">
                  {m.key} = {String(m.value)}
                </span>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            {result.why.map((w, i) => (
              <li key={i} className="text-sm text-slate-600 leading-relaxed">{w}</li>
            ))}
          </ul>
        </div>

        {/* Module B+ — Provenance */}
        {result.rejectedBecause && result.rejectedBecause.length > 0 && (
          <div className="p-6 border-b border-slate-100 bg-slate-50/60">
            <ModuleHeader index="B+" title={t(lang, 'provenanceTitle')} tone="slate" />
            <p className="text-xs text-slate-500 mb-3">{t(lang, 'provenanceSubtitle')}</p>
            <ul className="space-y-2">
              {result.rejectedBecause.map((r, i) => (
                <li key={i} className="bg-white rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500">{r.ruleId}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      T{r.tier} · P{r.priority}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-800">{r.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{r.reason}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Module C, D, E */}
        <div className="p-6 space-y-6">
          <div>
            <ModuleHeader index="C" title={t(lang, 'actionsTitle')} tone="teal" />
            <ol className="space-y-2">
              {result.actions.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed">{a}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <ModuleHeader index="D" title={t(lang, 'evidenceTitle')} tone="slate" />
            <p className="text-xs text-slate-500 italic mb-3">{t(lang, 'evidenceNote')}</p>
            <ul className="space-y-1.5">
              {result.evidence.map((e, i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-2">
                  <span className="text-slate-300">•</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ModuleHeader index="E" title={t(lang, 'resourcesTitle')} tone="teal" />
            <div className="grid sm:grid-cols-2 gap-3">
              {result.resources.map(r => (
                <a
                  key={r.short}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {r.kind}
                    </span>
                    <span className="text-[10px] text-slate-400 text-right">{r.covers}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.note}</p>
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:border-teal-300 transition"
          >
            {t(lang, 'startOver')}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed px-1">{t(lang, 'disclaimer')}</p>
    </section>
  );
}
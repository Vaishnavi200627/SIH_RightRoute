import { t } from '../i18n/strings';

const CATEGORIES = [
  { id: 'ncii', labelKey: 'catNcii', descKey: 'catNciiDesc', accent: 'from-purple-500 to-pink-500' },
  { id: 'fraud', labelKey: 'catFraud', descKey: 'catFraudDesc', accent: 'from-red-500 to-orange-500' },
  { id: 'account', labelKey: 'catAccount', descKey: 'catAccountDesc', accent: 'from-blue-500 to-cyan-500' },
  { id: 'stalking', labelKey: 'catStalking', descKey: 'catStalkingDesc', accent: 'from-rose-500 to-red-500' }
];

export default function CrisisPicker({ onPick, lang, selected }) {
  return (
    <section className="animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 mb-1">{t(lang, 'crisisTitle')}</h2>
      <p className="text-sm text-slate-500 mb-5">{t(lang, 'crisisSubtitle')}</p>
      <div className="grid gap-3">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
            className={`text-left p-5 rounded-2xl border-2 transition ${
              selected === c.id
                ? 'border-teal-500 bg-teal-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className={`inline-block w-10 h-1 rounded-full bg-gradient-to-r ${c.accent} mb-3`} />
            <div className="font-semibold text-slate-900">{t(lang, c.labelKey)}</div>
            <div className="text-sm text-slate-500 mt-1">{t(lang, c.descKey)}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
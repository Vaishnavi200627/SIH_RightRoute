import { Image, ShieldAlert, UserCog, UserX, ChevronRight } from 'lucide-react';
import { t } from '../i18n/strings';

const CATEGORIES = [
  {
    id: 'ncii',
    labelKey: 'catNcii',
    descKey: 'catNciiDesc',
    icon: Image,
    gradient: 'from-purple-500 to-pink-500',
    ring: 'ring-purple-200',
    bg: 'hover:bg-purple-50/60',
    border: 'hover:border-purple-400'
  },
  {
    id: 'fraud',
    labelKey: 'catFraud',
    descKey: 'catFraudDesc',
    icon: ShieldAlert,
    gradient: 'from-red-500 to-orange-500',
    ring: 'ring-red-200',
    bg: 'hover:bg-red-50/60',
    border: 'hover:border-red-400'
  },
  {
    id: 'account',
    labelKey: 'catAccount',
    descKey: 'catAccountDesc',
    icon: UserCog,
    gradient: 'from-blue-500 to-cyan-500',
    ring: 'ring-blue-200',
    bg: 'hover:bg-blue-50/60',
    border: 'hover:border-blue-400'
  },
  {
    id: 'stalking',
    labelKey: 'catStalking',
    descKey: 'catStalkingDesc',
    icon: UserX,
    gradient: 'from-rose-500 to-red-600',
    ring: 'ring-rose-200',
    bg: 'hover:bg-rose-50/60',
    border: 'hover:border-rose-400'
  }
];

export default function CrisisPicker({ onPick, lang, selected }) {
  return (
    <section className="animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 mb-1">{t(lang, 'crisisTitle')}</h2>
      <p className="text-sm text-slate-500 mb-5">{t(lang, 'crisisSubtitle')}</p>
      <div className="grid gap-3">
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          const isSelected = selected === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onPick(c.id)}
              className={`group relative text-left p-5 rounded-2xl border-2 bg-white transition-all duration-200 ${
                isSelected
                  ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-500/10'
                  : `border-slate-200 ${c.border} ${c.bg} hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5`
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} text-white flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-base leading-snug">
                    {t(lang, c.labelKey)}
                  </div>
                  <div className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {t(lang, c.descKey)}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-3" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
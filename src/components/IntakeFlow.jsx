import { AlertTriangle, Users, MessageSquareWarning, Camera, CreditCard, KeyRound, Radio, ChevronRight } from 'lucide-react';
import { t } from '../i18n/strings';

function Toggle({ value, onChange, yes, no }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 px-5 py-3 rounded-xl border-2 font-medium transition-all ${
          value === true
            ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md shadow-teal-500/10'
            : 'border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
        }`}
      >
        {yes}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 px-5 py-3 rounded-xl border-2 font-medium transition-all ${
          value === false
            ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md shadow-teal-500/10'
            : 'border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
        }`}
      >
        {no}
      </button>
    </div>
  );
}

function Question({ icon: Icon, title, hint, children, urgent, tone = 'teal' }) {
  const tones = {
    teal: { chip: 'from-teal-500 to-cyan-600', text: 'text-teal-700', ring: 'border-teal-100' },
    rose: { chip: 'from-rose-500 to-red-600', text: 'text-rose-700', ring: 'border-rose-200' }
  };
  const t0 = tones[tone] || tones.teal;
  return (
    <div className={`mb-6 ${urgent ? 'p-4 rounded-2xl bg-rose-50 border-2 border-rose-200' : ''}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${t0.chip} text-white flex items-center justify-center shadow-md`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${urgent ? 'text-rose-900' : 'text-slate-900'} leading-snug`}>
            {title}
          </h3>
          {hint && (
            <p className={`text-sm mt-1 ${urgent ? 'text-rose-700' : 'text-slate-500'}`}>
              {hint}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function IntakeFlow({ category, intake, setIntake, onSubmit, lang }) {
  const set = (k, v) => setIntake(prev => ({ ...prev, [k]: v }));

  const required = {
    ncii: ['physicalDanger', 'minor', 'threatened', 'ownership'],
    fraud: ['physicalDanger', 'fraudType', 'moneyLost'],
    account: ['physicalDanger', 'accountType'],
    stalking: ['physicalDanger', 'ongoing']
  }[category] || [];

  const answered = required.filter(k => intake[k] !== undefined).length;
  const complete = answered === required.length;
  const isNCII = category === 'ncii';

  return (
    <section className="animate-fade-in">
      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            {answered} / {required.length}
          </span>
          <div className="flex gap-1.5">
            {required.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < answered
                    ? 'w-8 bg-gradient-to-r from-teal-400 to-cyan-500'
                    : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <Question
        icon={AlertTriangle}
        title={t(lang, 'qPhysicalDanger')}
        hint={t(lang, 'qPhysicalDangerHint')}
        urgent
        tone="rose"
      >
        <Toggle
          value={intake.physicalDanger}
          onChange={v => set('physicalDanger', v)}
          yes={t(lang, 'yes')}
          no={t(lang, 'no')}
        />
      </Question>

      {isNCII && (
        <>
          <Question icon={Users} title={t(lang, 'qMinor')} hint={t(lang, 'qMinorHint')}>
            <Toggle
              value={intake.minor}
              onChange={v => set('minor', v)}
              yes={t(lang, 'yes')}
              no={t(lang, 'no')}
            />
          </Question>
          <Question icon={MessageSquareWarning} title={t(lang, 'qThreatened')} hint={t(lang, 'qThreatenedHint')}>
            <Toggle
              value={intake.threatened}
              onChange={v => set('threatened', v)}
              yes={t(lang, 'yes')}
              no={t(lang, 'no')}
            />
          </Question>
          <Question icon={Camera} title={t(lang, 'qOwnership')} hint={t(lang, 'qOwnershipHint')}>
            <div className="grid gap-2">
              {['self', 'consented', 'nonconsented'].map(opt => (
                <button
                  key={opt}
                  onClick={() => set('ownership', opt)}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${
                    intake.ownership === opt
                      ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-500/10'
                      : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-800">
                    {t(lang, `ownership${opt[0].toUpperCase()}${opt.slice(1)}`)}
                  </span>
                </button>
              ))}
            </div>
          </Question>
        </>
      )}

      {category === 'fraud' && (
        <>
          <Question icon={CreditCard} title={t(lang, 'qFraudType')}>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                ['upi', 'UPI'],
                ['otp', 'OTP'],
                ['phishing', 'Phishing'],
                ['other', 'Other']
              ].map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => set('fraudType', k)}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${
                    intake.fraudType === k
                      ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-500/10'
                      : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-800">{label}</span>
                </button>
              ))}
            </div>
          </Question>
          <Question icon={AlertTriangle} title={t(lang, 'qMoneyLost')} hint={t(lang, 'qMoneyLostHint')}>
            <Toggle
              value={intake.moneyLost}
              onChange={v => set('moneyLost', v)}
              yes={t(lang, 'yes')}
              no={t(lang, 'no')}
            />
          </Question>
        </>
      )}

      {category === 'account' && (
        <Question icon={KeyRound} title={t(lang, 'qAccountType')}>
          <div className="grid gap-2">
            {[
              ['hacked', 'Account hacked / takeover'],
              ['locked', 'Account locked / suspended'],
              ['compromised', 'Suspicious activity']
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => set('accountType', k)}
                className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  intake.accountType === k
                    ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-500/10'
                    : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-medium text-slate-800">{label}</span>
              </button>
            ))}
          </div>
        </Question>
      )}

      {category === 'stalking' && (
        <Question icon={Radio} title={t(lang, 'qOngoing')}>
          <Toggle
            value={intake.ongoing}
            onChange={v => set('ongoing', v)}
            yes={t(lang, 'yes')}
            no={t(lang, 'no')}
          />
        </Question>
      )}

      <button
        onClick={onSubmit}
        disabled={!complete}
        className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          complete
            ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {t(lang, 'continue')}
        {complete && <ChevronRight className="w-4 h-4" />}
      </button>
    </section>
  );
}
import { t } from '../i18n/strings';

function Toggle({ value, onChange, yes, no }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange(true)}
        className={`px-5 py-2.5 rounded-xl border-2 font-medium transition ${
          value === true
            ? 'border-teal-500 bg-teal-50 text-teal-700'
            : 'border-slate-200 text-slate-700 hover:border-teal-300'
        }`}
      >
        {yes}
      </button>
      <button
        onClick={() => onChange(false)}
        className={`px-5 py-2.5 rounded-xl border-2 font-medium transition ${
          value === false
            ? 'border-teal-500 bg-teal-50 text-teal-700'
            : 'border-slate-200 text-slate-700 hover:border-teal-300'
        }`}
      >
        {no}
      </button>
    </div>
  );
}

function Question({ title, hint, children, urgent }) {
  return (
    <div className={`mb-6 ${urgent ? 'p-4 rounded-xl bg-rose-50 border border-rose-200' : ''}`}>
      <h3 className={`font-semibold mb-1 ${urgent ? 'text-rose-900' : 'text-slate-900'}`}>{title}</h3>
      {hint && <p className={`text-sm mb-3 ${urgent ? 'text-rose-700' : 'text-slate-500'}`}>{hint}</p>}
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

  const complete = required.every(k => intake[k] !== undefined);
  const isNCII = category === 'ncii';

  return (
    <section className="animate-fade-in">
      <Question
        title={t(lang, 'qPhysicalDanger')}
        hint={t(lang, 'qPhysicalDangerHint')}
        urgent
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
          <Question title={t(lang, 'qMinor')} hint={t(lang, 'qMinorHint')}>
            <Toggle
              value={intake.minor}
              onChange={v => set('minor', v)}
              yes={t(lang, 'yes')}
              no={t(lang, 'no')}
            />
          </Question>
          <Question title={t(lang, 'qThreatened')} hint={t(lang, 'qThreatenedHint')}>
            <Toggle
              value={intake.threatened}
              onChange={v => set('threatened', v)}
              yes={t(lang, 'yes')}
              no={t(lang, 'no')}
            />
          </Question>
          <Question title={t(lang, 'qOwnership')} hint={t(lang, 'qOwnershipHint')}>
            <div className="grid gap-2">
              {['self', 'consented', 'nonconsented'].map(opt => (
                <button
                  key={opt}
                  onClick={() => set('ownership', opt)}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition ${
                    intake.ownership === opt
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  {t(lang, `ownership${opt[0].toUpperCase()}${opt.slice(1)}`)}
                </button>
              ))}
            </div>
          </Question>
        </>
      )}

      {category === 'fraud' && (
        <>
          <Question title={t(lang, 'qFraudType')}>
            <div className="grid gap-2">
              {[
                ['upi', 'UPI'],
                ['otp', 'OTP'],
                ['phishing', 'Phishing'],
                ['other', 'Other']
              ].map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => set('fraudType', k)}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition ${
                    intake.fraudType === k
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Question>
          <Question title={t(lang, 'qMoneyLost')} hint={t(lang, 'qMoneyLostHint')}>
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
        <Question title={t(lang, 'qAccountType')}>
          <div className="grid gap-2">
            {[
              ['hacked', 'Account hacked / takeover'],
              ['locked', 'Account locked / suspended'],
              ['compromised', 'Suspicious activity']
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => set('accountType', k)}
                className={`text-left px-4 py-3 rounded-xl border-2 transition ${
                  intake.accountType === k
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Question>
      )}

      {category === 'stalking' && (
        <Question title={t(lang, 'qOngoing')}>
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
        className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {t(lang, 'continue')}
      </button>
    </section>
  );
}
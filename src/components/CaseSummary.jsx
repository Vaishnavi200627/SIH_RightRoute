import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Shield,
  FileText,
  Copy,
  Check,
  Scale,
  ArrowLeft,
  FileLock,
  Layers,
  AlertOctagon,
  Clock
} from 'lucide-react';
import { t } from '../i18n/strings';
import { tierLabel } from '../lib/engine';
import { getPotentialLegalSections } from '../lib/legal';
import { downloadComplaintDraft } from './Evidence';

/**
 * CaseSummary Component
 * Displays a client-side crisis dossier and statutory reference overview.
 *
 * @param {object} props
 * @param {object} props.intake - Current intake question responses
 * @param {object|null} props.result - Evaluated route result
 * @param {string} props.lang - Active language code
 * @param {object|null} props.evidence - Hashed file metadata { fileName, fileSize, fileType, fileHash }
 * @param {function} [props.onDownloadDraft] - Optional handler to trigger draft download
 * @param {function} [props.onNavigateBack] - Optional handler to navigate back to flow
 */
export default function CaseSummary({
  intake = {},
  result = null,
  lang = 'en',
  evidence = null,
  onDownloadDraft = null,
  onNavigateBack = null
}) {
  const [copied, setCopied] = useState(false);

  // Consistent local ref id for this intake
  const localRefId = useMemo(() => {
    return intake?.localRefId || (intake?.refTimestamp ? `RR-${intake.refTimestamp}` : `RR-${Date.now()}`);
  }, [intake?.localRefId, intake?.refTimestamp]);

  const activeCategory =
    intake?.category ||
    (result?.matchedOn?.find(m => m.key === 'category')?.value) ||
    '';

  const categoryLabels = {
    ncii: 'Non-Consensual Intimate Imagery (NCII)',
    fraud: 'Financial Cyber Fraud',
    account: 'Account or Device Takeover',
    stalking: 'Cyber Stalking / Harassment'
  };

  const categoryDisplay = activeCategory ? (categoryLabels[activeCategory] || activeCategory.toUpperCase()) : 'Not Selected';

  // Compute Priority Tier
  const priorityDisplay = result?.tier
    ? tierLabel(result.tier)
    : intake?.physicalDanger
    ? 'P1 · Immediate safety'
    : 'Pending Intake Triage';

  // Compute Threat Status
  let threatStatus = {
    label: 'No Immediate Threat Flagged',
    tone: 'teal',
    detail: 'Standard reporting pathway'
  };

  if (intake?.physicalDanger) {
    threatStatus = {
      label: 'Immediate Physical Danger Flagged',
      tone: 'rose',
      detail: 'Emergency services prioritized'
    };
  } else if (intake?.threatened) {
    threatStatus = {
      label: 'Active Extortion / Coercion Threat',
      tone: 'amber',
      detail: 'Evidence preservation & emergency takedown recommended'
    };
  } else if (intake?.ongoing) {
    threatStatus = {
      label: 'Ongoing Incident / Harassment',
      tone: 'amber',
      detail: 'Repeated unauthorized contact documented'
    };
  } else if (!activeCategory) {
    threatStatus = {
      label: 'Intake Pending',
      tone: 'slate',
      detail: 'Crisis intake questions not yet completed'
    };
  }

  // Legal Sections
  const legalSections = getPotentialLegalSections(activeCategory);

  function copyHash() {
    if (!evidence?.fileHash) return;
    navigator.clipboard.writeText(evidence.fileHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    if (onDownloadDraft) {
      onDownloadDraft();
    } else {
      downloadComplaintDraft(lang, intake, result, evidence);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* CRITICAL BANNER AT THE VERY TOP */}
      <div className="bg-amber-950/80 border-2 border-amber-500/90 text-amber-200 p-4 sm:p-5 rounded-2xl shadow-xl shadow-amber-950/30 flex items-start sm:items-center gap-3.5 backdrop-blur-sm">
        <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1">
          <p className="font-bold text-sm sm:text-base tracking-wide leading-snug">
            ⚠️ This view is generated locally. It is not connected to any police system or NCRP.
          </p>
          <p className="text-xs text-amber-300/80 mt-1">
            All data remains strictly on your device. This case summary acts as a structured reference guide.
          </p>
        </div>
      </div>

      {/* Main Dossier Container - Dark Slate & Teal Theme */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100">
        {/* Dossier Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-teal-400 uppercase">
                Privacy-Preserving Dossier
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
              {t(lang, 'caseSummary')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Client-side incident triage and statutory provisions mapping.
            </p>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Local Reference Identifier
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-sm sm:text-base font-bold text-teal-300 bg-slate-950 px-3 py-1 rounded-lg border border-teal-900/60 shadow-inner">
                {localRefId}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Local Reference Only.
              </span>
            </div>
          </div>
        </div>

        {/* 3 Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Category Card */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Category</span>
              <Layers className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 leading-snug">
                {categoryDisplay}
              </h3>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {activeCategory ? `Key: ${activeCategory}` : 'No crisis category selected'}
              </span>
            </div>
          </div>

          {/* Priority Tier Card */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Priority Tier</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-cyan-300 leading-snug">
                {priorityDisplay}
              </h3>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {result ? `Rule Matched: ${result.ruleId}` : 'Determined by ruleset engine'}
              </span>
            </div>
          </div>

          {/* Threat Status Card */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Threat Status</span>
              <AlertOctagon
                className={`w-4 h-4 ${
                  threatStatus.tone === 'rose'
                    ? 'text-rose-400'
                    : threatStatus.tone === 'amber'
                    ? 'text-amber-400'
                    : 'text-teal-400'
                }`}
              />
            </div>
            <div>
              <span
                className={`inline-block font-bold text-xs px-2.5 py-1 rounded-md mb-1 ${
                  threatStatus.tone === 'rose'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                    : threatStatus.tone === 'amber'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                    : 'bg-teal-950/80 text-teal-300 border border-teal-800'
                }`}
              >
                {threatStatus.label}
              </span>
              <span className="text-[10px] text-slate-500 block">{threatStatus.detail}</span>
            </div>
          </div>
        </div>

        {/* Legal Mapping Section */}
        <div className="mt-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  Potential Statutory Provisions (Legal Mapping)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tentative statutory alignment for legal drafting review.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex text-[10px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Human Review Required
            </span>
          </div>

          <div className="space-y-3">
            {legalSections.map((item, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-teal-300 text-sm">
                      {item.act}, {item.section}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">· {item.title}</span>
                  </div>

                  {/* Highly visible REVIEW_REQUIRED badge */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-950 border border-rose-600/80 text-rose-300 text-[10px] font-extrabold tracking-wider uppercase shadow-sm">
                    ⚠️ {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 italic">
                  Note: {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Hash Section */}
        <div className="mt-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <FileLock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  {t(lang, 'evidenceIntegrityRecord')}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Cryptographic client-side file digest (SHA-256).
                </p>
              </div>
            </div>

            {evidence?.fileHash && (
              <button
                type="button"
                onClick={copyHash}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-teal-800 px-3 py-1 rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t(lang, 'copied') : 'Copy Hash'}
              </button>
            )}
          </div>

          {evidence?.fileHash ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">
                    File Name
                  </span>
                  <span className="font-semibold text-slate-200 break-all">{evidence.fileName}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">
                    File Size
                  </span>
                  <span className="font-semibold text-slate-200">{evidence.fileSize}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">
                    File Type
                  </span>
                  <span className="font-semibold text-slate-200 break-all">{evidence.fileType}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  SHA-256 Checksum
                </span>
                <div className="font-mono text-xs text-emerald-400 bg-slate-950 p-3.5 rounded-xl border border-slate-800 break-all selection:bg-teal-700">
                  {evidence.fileHash}
                </div>
              </div>

              {/* Exact required disclaimer */}
              <p className="text-xs text-slate-400 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                This SHA-256 hash verifies the file has not been altered since this moment. It does not establish chain of custody or authenticity. The file never left your device.
              </p>
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
              <Shield className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">
                No evidence file hashed yet.
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                Evidence hashing is 100% client-side and optional. You can upload an image or document in the Navigator view to calculate its tamper-evident SHA-256 fingerprint.
              </p>
            </div>
          )}
        </div>

        {/* Narrative / Intake Overview */}
        {Object.keys(intake).length > 0 && (
          <div className="mt-8 bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Recorded Intake Responses
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(intake)
                .filter(([k]) => !['localRefId', 'refTimestamp'].includes(k))
                .map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800/80"
                  >
                    <span className="text-slate-400 font-medium capitalize">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-semibold text-teal-300">
                      {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons at the bottom */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {onNavigateBack ? (
            <button
              type="button"
              onClick={onNavigateBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              {t(lang, 'navigator')}
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all text-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            {t(lang, 'downloadDraft')}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import jsPDF from 'jspdf';
import { FileLock, Upload, Copy, Check, Download, Shield, CircleCheck, Loader2 } from 'lucide-react';
import { sha256 } from '../lib/hash';
import { t } from '../i18n/strings';
import { tierLabel } from '../lib/engine';

export default function Evidence({ lang, result }) {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setBusy(true);
    try {
      setHash(await sha256(f));
    } finally {
      setBusy(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadActionPlan() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 48;
    let y = margin;

    // Header band
    doc.setFillColor(15, 118, 110);
    doc.rect(0, 0, pageW, 70, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RightRoute — Action Plan', margin, 44);

    y = 100;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toISOString()}`, margin, y);
    y += 14;
    if (result) {
      doc.text(`Rule: ${result.ruleId} · ${tierLabel(result.tier)} · ruleset v${result.rulesetVersion}`, margin, y);
      y += 24;
    } else {
      y += 12;
    }

    if (result) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Suggested route', margin, y);
      y += 16;
      doc.setFontSize(14);
      doc.text(result.label, margin, y);
      y += 22;

      doc.setFontSize(12);
      doc.text('Why this route', margin, y);
      y += 16;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      for (const w of result.why) {
        const lines = doc.splitTextToSize(`• ${w}`, pageW - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 13;
      }
      y += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Do this now', margin, y);
      y += 16;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      result.actions.forEach((a, i) => {
        const lines = doc.splitTextToSize(`${i + 1}. ${a}`, pageW - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 13;
      });
      y += 10;

      if (y > 620) { doc.addPage(); y = margin; }
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Preserve this', margin, y);
      y += 16;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      for (const e of result.evidence) {
        const lines = doc.splitTextToSize(`• ${e}`, pageW - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 13;
      }
      y += 10;

      if (y > 620) { doc.addPage(); y = margin; }
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Official resources', margin, y);
      y += 16;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      for (const r of result.resources) {
        doc.setFont('helvetica', 'bold');
        doc.text(r.name, margin, y);
        y += 12;
        doc.setFont('helvetica', 'normal');
        const urlLines = doc.splitTextToSize(r.url, pageW - margin * 2);
        doc.text(urlLines, margin, y);
        y += urlLines.length * 12 + 4;
      }
    }

    if (hash && file) {
      if (y > 620) { doc.addPage(); y = margin; }
      y += 10;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageW - margin, y);
      y += 20;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('File integrity reference', margin, y);
      y += 16;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, margin, y);
      y += 14;
      doc.text('SHA-256:', margin, y);
      y += 14;
      doc.setFont('courier', 'normal');
      doc.setFontSize(9);
      const hashLines = doc.splitTextToSize(hash, pageW - margin * 2);
      doc.text(hashLines, margin, y);
      y += hashLines.length * 11;
    }

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text(
      'This is a personal integrity reference, not a legal certificate. The original file never left your device.',
      margin,
      doc.internal.pageSize.getHeight() - 40
    );

    doc.save('rightroute-action-plan.pdf');
  }

  return (
    <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <FileLock className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
              Module F
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              {t(lang, 'evidenceSectionTitle')}
            </h3>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-medium text-white">
          <Shield className="w-3 h-3" />
          Local only
        </span>
      </div>

      <div className="p-6">
        <p className="text-xs text-slate-500 mb-4">{t(lang, 'evidenceSectionDesc')}</p>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-2 block">
            {t(lang, 'uploadLabel')}
          </span>
          <div className="relative">
            <input
              type="file"
              onChange={handleFile}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-teal-50 file:to-cyan-50 file:text-teal-700 hover:file:from-teal-100 hover:file:to-cyan-100 file:cursor-pointer cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-2 hover:border-teal-300 transition"
            />
            <Upload className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none hidden sm:block" />
          </div>
        </label>

        {file && (
          <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CircleCheck className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-medium">{file.name}</span>
                <span className="text-slate-400">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              {hash && !busy && (
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-800 px-2.5 py-1 rounded-lg bg-white border border-teal-200 hover:border-teal-300 transition"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? t(lang, 'copied') : 'Copy'}
                </button>
              )}
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {t(lang, 'hashLabel')}
            </div>
            <div className="font-mono text-[11px] bg-slate-900 text-emerald-300 p-3 rounded-lg break-all">
              {busy ? (
                <span className="inline-flex items-center gap-2 text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t(lang, 'hashing')}
                </span>
              ) : (
                hash
              )}
            </div>
          </div>
        )}

        <button
          onClick={downloadActionPlan}
          disabled={busy}
          className={`mt-4 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            !busy
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Download className="w-4 h-4" />
          {t(lang, 'downloadPdf')}
        </button>
      </div>
    </section>
  );
}
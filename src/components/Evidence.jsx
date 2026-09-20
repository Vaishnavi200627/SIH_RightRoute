import { useState } from 'react';
import jsPDF from 'jspdf';
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

    // Rule meta
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

    // Section: Route
    if (result) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Suggested route', margin, y);
      y += 16;
      doc.setFontSize(14);
      doc.text(result.label, margin, y);
      y += 22;

      // Why
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

      // Actions
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

      // Evidence to preserve
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

      // Resources
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

    // Hash section
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

    // Footer disclaimer
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
    <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-900 mb-1">{t(lang, 'evidenceSectionTitle')}</h3>
      <p className="text-xs text-slate-500 mb-4">{t(lang, 'evidenceSectionDesc')}</p>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">{t(lang, 'uploadLabel')}</span>
        <input
          type="file"
          onChange={handleFile}
          className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
        />
      </label>

      {file && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{t(lang, 'hashLabel')}</span>
            {hash && !busy && (
              <button onClick={copy} className="text-teal-600 hover:text-teal-700 font-medium">
                {copied ? t(lang, 'copied') : 'Copy'}
              </button>
            )}
          </div>
          <div className="font-mono text-[11px] bg-slate-900 text-emerald-300 p-3 rounded-lg break-all">
            {busy ? t(lang, 'hashing') : hash}
          </div>
        </div>
      )}

      <button
        onClick={downloadActionPlan}
        className="mt-4 w-full py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
      >
        {t(lang, 'downloadPdf')}
      </button>
    </section>
  );
}
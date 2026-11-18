import React, { useMemo } from 'react';
import { ShieldAlert, RotateCcw, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { validateCitizenReport, computeMerkleRoot } from '../utils/sanitize';
import ReportForm from '../components/reports/ReportForm';
import ReportTimeline from '../components/reports/ReportTimeline';

/**
 * Secure Citizen Air & Smog Reports Page.
 * Manages SHA-256 hash-chained citizen reporting, tamper detection, and triage workflows.
 */
export default function CitizenReports() {
  const {
    citizenReports,
    addCitizenReport,
    advanceReportStage,
    simulateTamper,
    verifyLedger,
    ledgerTampered,
    addToast
  } = useApp();

  const merkleRootHex = useMemo(
    () => computeMerkleRoot(citizenReports.map((r) => r.hash)),
    [citizenReports]
  );

  const handleSubmitReport = (rawPayload) => {
    const validation = validateCitizenReport(rawPayload);
    if (!validation.isValid) {
      addToast('Validation Error', validation.errors[0] || 'Invalid report fields', 'rose');
      return;
    }
    addCitizenReport(validation.sanitized);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="06 · Community Signal"
        title="Secure Citizen Air & Smog Reports"
        desc="Every shoreline and ward observation is hashed with SHA-256 and chained to the previous one — a tamper-evident ledger, so no report can be silently altered or deleted."
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={simulateTamper}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/20 px-3 py-1.5 font-mono text-xs text-rose-200 hover:bg-rose-500/30 transition cursor-pointer"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Simulate Tamper
            </button>
            <button
              onClick={verifyLedger}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-400/20 px-3 py-1.5 font-mono text-xs text-emerald-200 hover:bg-emerald-400/30 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Verify Ledger
            </button>
          </div>
        }
      />

      {/* Tamper Warning Banner if ledger is tampered */}
      {ledgerTampered && (
        <div className="panel p-4 border-rose-500 bg-rose-500/20 text-rose-200 shadow-glow-red flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0 animate-pulse" />
            <div>
              <div className="font-bold text-sm">SECURITY ALERT: Cryptographic Chain Broken!</div>
              <div className="text-xs font-mono text-rose-300">
                Block #2 payload was modified out-of-band. The recalculated SHA-256 hash does not
                match next block&apos;s prevHash pointer.
              </div>
            </div>
          </div>
          <button
            onClick={verifyLedger}
            className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-mono text-xs font-bold hover:bg-rose-400 transition cursor-pointer"
          >
            Run Zero-Data-Loss Repair Engine
          </button>
        </div>
      )}

      {/* Submit Report Form + Hash Chain Visualization */}
      <div className="grid gap-6 xl:grid-cols-3">
        <ReportForm onSubmitReport={handleSubmitReport} merkleRootHex={merkleRootHex} />
        <ReportTimeline
          citizenReports={citizenReports}
          ledgerTampered={ledgerTampered}
          onAdvanceStage={advanceReportStage}
        />
      </div>

      {/* Recent Citizen Reports Table */}
      <div className="panel p-5 space-y-3">
        <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
          <div>
            <span className="label text-cyan-300">Workflow Tracker</span>
            <h2 className="text-lg font-bold text-white">Active Community Air Reports</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Total Reports: {citizenReports.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyan-400/10 text-slate-500">
                <th className="pb-2 font-normal">Report ID</th>
                <th className="pb-2 font-normal">Issue Description</th>
                <th className="pb-2 font-normal">Ward Location</th>
                <th className="pb-2 font-normal">Reporter</th>
                <th className="pb-2 font-normal">SHA-256 Hash</th>
                <th className="pb-2 font-normal">Stage Workflow</th>
                <th className="pb-2 font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-400/5">
              {citizenReports
                .slice()
                .reverse()
                .map((rep) => (
                  <tr key={rep.id} className="hover:bg-white/5 transition">
                    <td className="py-3 text-cyan-300 font-bold">{rep.id}</td>
                    <td className="py-3 text-white font-sans max-w-xs truncate">{rep.issue}</td>
                    <td className="py-3 text-slate-300">{rep.location}</td>
                    <td className="py-3 text-slate-400">{rep.reporter}</td>
                    <td className="py-3 text-slate-500 font-mono text-[10px]">
                      {rep.hash.slice(0, 12)}...
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-2 w-5 rounded-sm ${
                              step <= rep.stage ? 'bg-cyan-400' : 'bg-slate-700'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-[10px] text-slate-300 font-sans">
                          {rep.statusText}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {rep.stage < 4 ? (
                        <button
                          onClick={() => advanceReportStage(rep.id)}
                          aria-label={`Advance triage stage for report ${rep.id}`}
                          className="text-cyan-300 hover:underline font-mono text-[11px] cursor-pointer flex items-center gap-1"
                        >
                          Advance &rarr;
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

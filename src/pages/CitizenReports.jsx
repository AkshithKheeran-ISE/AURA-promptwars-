import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ShieldAlert, RotateCcw, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useLedger, useUi } from '../context/AppContext';
import { validateCitizenReport, computeMerkleRoot } from '../utils/sanitize';
import ReportForm from '../components/reports/ReportForm';
import ReportTimeline from '../components/reports/ReportTimeline';

function TamperWarningBanner({ onVerify }) {
  return (
    <div className="panel p-4 border-rose-500 bg-rose-500/20 text-rose-200 shadow-glow-red flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0 animate-pulse" />
        <div>
          <div className="font-bold text-sm">SECURITY ALERT: Cryptographic Chain Broken!</div>
          <div className="text-xs font-mono text-rose-300">
            Block #2 payload was modified out-of-band. The recalculated SHA-256 hash does not match
            next block&apos;s prevHash pointer.
          </div>
        </div>
      </div>
      <button
        onClick={onVerify}
        className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-mono text-xs font-bold hover:bg-rose-400 transition cursor-pointer"
      >
        Run Zero-Data-Loss Repair Engine
      </button>
    </div>
  );
}

TamperWarningBanner.propTypes = {
  onVerify: PropTypes.func.isRequired
};

/**
 * @param {{ rep: any, onAdvanceStage: (id: string) => void }} props
 */
function ReportTableRowBase({ rep, onAdvanceStage }) {
  return (
    <tr className="hover:bg-white/5 transition">
      <td className="py-3 text-cyan-300 font-bold">{rep.id}</td>
      <td className="py-3 text-white font-sans max-w-xs truncate">{rep.issue}</td>
      <td className="py-3 text-slate-300">{rep.location}</td>
      <td className="py-3 text-slate-400">{rep.reporter}</td>
      <td className="py-3 text-slate-400 font-mono text-[10px]">{rep.hash.slice(0, 12)}...</td>
      <td className="py-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 w-5 rounded-sm ${step <= rep.stage ? 'bg-cyan-400' : 'bg-slate-700'}`}
            />
          ))}
          <span className="ml-2 text-[10px] text-slate-300 font-sans">{rep.statusText}</span>
        </div>
      </td>
      <td className="py-3">
        {rep.stage < 4 ? (
          <button
            onClick={() => onAdvanceStage(rep.id)}
            aria-label={`Advance triage stage for report ${rep.id}`}
            className="text-cyan-300 hover:underline font-mono text-[11px] cursor-pointer flex items-center gap-1"
          >
            Advance &rarr;
          </button>
        ) : (
          <span className="text-emerald-400 text-[11px] flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
          </span>
        )}
      </td>
    </tr>
  );
}

const ReportTableRow = React.memo(ReportTableRowBase);

ReportTableRowBase.propTypes = {
  rep: PropTypes.shape({
    id: PropTypes.string.isRequired,
    issue: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    reporter: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    stage: PropTypes.number.isRequired,
    statusText: PropTypes.string.isRequired
  }).isRequired,
  onAdvanceStage: PropTypes.func.isRequired
};

function CitizenReportsTable({ reports, onAdvanceStage }) {
  const reversedReports = useMemo(() => reports.slice().reverse(), [reports]);

  return (
    <div className="panel p-5 space-y-3">
      <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
        <div>
          <span className="label text-cyan-300">Workflow Tracker</span>
          <h2 className="text-lg font-bold text-white">Active Community Air Reports</h2>
        </div>
        <span className="font-mono text-xs text-slate-400">Total Reports: {reports.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-400/10 text-slate-400">
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
            {reversedReports.map((rep) => (
              <ReportTableRow key={rep.id} rep={rep} onAdvanceStage={onAdvanceStage} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CitizenReportsTable.propTypes = {
  reports: PropTypes.array.isRequired,
  onAdvanceStage: PropTypes.func.isRequired
};

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
    ledgerTampered
  } = useLedger();
  const { addToast } = useUi();

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
      <SectionHeader
        eyebrow="06 · Community Signal"
        title="Secure Citizen Air & Smog Reports"
        desc="Every shoreline and ward observation is hashed with SHA-256 and chained to the previous one — a tamper-evident ledger, so no report can be silently altered or deleted."
        right={
          <div className="flex items-center gap-2">
            <span
              title={`Binary Merkle Root: ${merkleRootHex}`}
              className="font-mono text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-400/30 px-2 py-1 rounded-md hidden lg:inline-block"
            >
              Merkle Root: {merkleRootHex.slice(0, 12)}...
            </span>
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

      {ledgerTampered && <TamperWarningBanner onVerify={verifyLedger} />}

      <div className="grid gap-6 xl:grid-cols-3">
        <ReportForm onSubmitReport={handleSubmitReport} merkleRootHex={merkleRootHex} />
        <ReportTimeline
          citizenReports={citizenReports}
          ledgerTampered={ledgerTampered}
          onAdvanceStage={advanceReportStage}
        />
      </div>

      <CitizenReportsTable reports={citizenReports} onAdvanceStage={advanceReportStage} />
    </div>
  );
}

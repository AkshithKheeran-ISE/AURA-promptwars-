import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Lock, CheckCircle2 } from 'lucide-react';

/**
 * @param {{ rep: any, idx: number, isCorrupt: boolean, onAdvanceStage: (id: string) => void }} props
 */
function TimelineCardBase({ rep, idx, isCorrupt, onAdvanceStage }) {
  return (
    <div
      className={`w-72 shrink-0 p-3.5 rounded-xl border font-mono text-xs space-y-2 transition relative ${
        isCorrupt
          ? 'border-rose-500 bg-rose-500/20 shadow-glow-red animate-pulse'
          : 'border-cyan-400/20 bg-[#030712] hover:border-cyan-400/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-cyan-300">BLOCK #{idx + 1}</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded ${
            isCorrupt ? 'bg-rose-500 text-white' : 'bg-emerald-400/15 text-emerald-300'
          }`}
        >
          {isCorrupt ? 'TAMPERED' : 'VALIDATED'}
        </span>
      </div>

      <div className="text-xs text-white font-sans font-semibold line-clamp-2">{rep.issue}</div>

      <div className="text-[10px] text-slate-400">
        <div>
          {rep.reporter} · {rep.location}
        </div>
      </div>

      {/* Hash readouts */}
      <div className="text-[10px] space-y-1 pt-1 border-t border-cyan-400/10">
        <div className="truncate text-slate-400">
          <span className="text-slate-400">prev:</span> {rep.prevHash.slice(0, 16)}...
        </div>
        <div className="truncate text-cyan-400">
          <span className="text-slate-400">hash:</span> {rep.hash.slice(0, 16)}...
        </div>
      </div>

      {/* Stage Progress Tracker */}
      <div className="pt-2 border-t border-cyan-400/10 flex items-center justify-between text-[10px]">
        <span className="text-slate-400">{rep.statusText}</span>
        {rep.stage < 4 && (
          <button
            onClick={() => onAdvanceStage(rep.id)}
            className="text-cyan-400 hover:text-cyan-200 transition cursor-pointer font-bold"
          >
            Next Stage &rarr;
          </button>
        )}
        {rep.stage === 4 && (
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <CheckCircle2 className="h-3 w-3" /> Resolved
          </span>
        )}
      </div>
    </div>
  );
}

const TimelineCard = memo(TimelineCardBase);

TimelineCardBase.propTypes = {
  rep: PropTypes.shape({
    id: PropTypes.string.isRequired,
    issue: PropTypes.string.isRequired,
    reporter: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    prevHash: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    statusText: PropTypes.string.isRequired,
    stage: PropTypes.number.isRequired
  }).isRequired,
  idx: PropTypes.number.isRequired,
  isCorrupt: PropTypes.bool.isRequired,
  onAdvanceStage: PropTypes.func.isRequired
};

/**
 * Visual timeline of cryptographic citizen report blocks with hash pointers.
 */
export default function ReportTimeline({ citizenReports, ledgerTampered, onAdvanceStage }) {
  return (
    <div className="panel p-5 xl:col-span-2 space-y-4">
      <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
        <div>
          <span className="label text-emerald-400">Cryptographic Integrity</span>
          <h2 className="text-lg font-bold text-white">SHA-256 Hash-Chained Blocks</h2>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
          <Lock className="h-3.5 w-3.5 text-cyan-400" />
          <span>Chain Depth: {citizenReports.length} Blocks</span>
        </div>
      </div>

      {/* Horizontal Hash Chain Cards */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1">
        {citizenReports.map((rep, idx) => (
          <TimelineCard
            key={rep.id}
            rep={rep}
            idx={idx}
            isCorrupt={ledgerTampered && idx === 1}
            onAdvanceStage={onAdvanceStage}
          />
        ))}
      </div>
    </div>
  );
}

ReportTimeline.propTypes = {
  citizenReports: PropTypes.array.isRequired,
  ledgerTampered: PropTypes.bool.isRequired,
  onAdvanceStage: PropTypes.func.isRequired
};

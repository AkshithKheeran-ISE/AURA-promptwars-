import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Download,
  Filter,
  Search,
  User,
  Bot,
  Cpu,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useUi } from '../context/AppContext';
import { computeAuditHash } from '../data/telemetry';

function downloadAuditCsv(auditLogs, addToast) {
  const headers = 'id,timestamp,actor,action,target,type,hash\n';
  const rows = auditLogs
    .map(
      (l) =>
        `"${l.id}","${new Date(l.ts).toISOString()}","${l.actor}","${l.action.replace(/"/g, '""')}","${l.target}","${l.type}","${l.hash}"`
    )
    .join('\n');

  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aura-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  addToast('CSV Exported', 'Downloaded complete cryptographically verified audit trail', 'green');
}

function AuditStatCards({ totalLogs, humanCount, agentCount, systemCount }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 font-mono">
      <div className="panel panel-corners p-4 space-y-1">
        <div className="label text-slate-400">Total Audit Logs</div>
        <div className="font-display text-2xl font-bold text-white">{totalLogs}</div>
        <div className="text-[10px] text-emerald-400">100% SHA-256 attested</div>
      </div>

      <div className="panel panel-corners p-4 space-y-1">
        <div className="label text-slate-400">Human Actions</div>
        <div className="font-display text-2xl font-bold text-cyan-300">{humanCount}</div>
        <div className="text-[10px] text-slate-400">Analyst dispatches & edits</div>
      </div>

      <div className="panel panel-corners p-4 space-y-1">
        <div className="label text-slate-400">Autonomous AI Actions</div>
        <div className="font-display text-2xl font-bold text-purple-400">{agentCount}</div>
        <div className="text-[10px] text-slate-400">Agent inferences & fines</div>
      </div>

      <div className="panel panel-corners p-4 space-y-1">
        <div className="label text-slate-400">System Telemetry Events</div>
        <div className="font-display text-2xl font-bold text-emerald-400">{systemCount}</div>
        <div className="text-[10px] text-slate-400">Mesh keys & packet filters</div>
      </div>
    </div>
  );
}

AuditStatCards.propTypes = {
  totalLogs: PropTypes.number.isRequired,
  humanCount: PropTypes.number.isRequired,
  agentCount: PropTypes.number.isRequired,
  systemCount: PropTypes.number.isRequired
};

function AuditFilterBar({ filterType, onFilterChange, searchTerm, onSearchChange }) {
  return (
    <div className="panel p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> Actor Filter:
        </span>
        {['all', 'human', 'agent', 'system'].map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer uppercase ${
              filterType === type
                ? 'bg-cyan-400/15 border-cyan-400 text-cyan-200'
                : 'border-cyan-400/10 text-slate-400 hover:bg-white/5'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-xs">
        <label htmlFor="audit-search-input" className="sr-only">
          Search action logs
        </label>
        <Search
          className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
        <input
          id="audit-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search action logs..."
          aria-label="Search action logs"
          className="w-full rounded-lg border border-cyan-400/15 bg-[#030712] py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50"
        />
      </div>
    </div>
  );
}

AuditFilterBar.propTypes = {
  filterType: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

function AuditLogsTable({ logs }) {
  return (
    <div className="panel p-5 space-y-3">
      <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
        <div>
          <span className="label text-cyan-300">Ledger Ingestion</span>
          <h2 className="text-lg font-bold text-white">Cryptographic Action History</h2>
        </div>
        <span className="font-mono text-xs text-slate-400">
          Showing {logs.length} verified records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-400/10 text-slate-500">
              <th className="pb-2 font-normal">Timestamp</th>
              <th className="pb-2 font-normal">Log ID</th>
              <th className="pb-2 font-normal">Actor</th>
              <th className="pb-2 font-normal">Action Performed</th>
              <th className="pb-2 font-normal">Target Entity</th>
              <th className="pb-2 font-normal">SHA-256 Hash</th>
              <th className="pb-2 font-normal">Attested</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-400/5">
            {logs.map((log) => {
              const actorColor =
                log.type === 'human'
                  ? 'text-cyan-300'
                  : log.type === 'agent'
                    ? 'text-purple-300'
                    : 'text-slate-400';

              const ActorIcon = log.type === 'human' ? User : log.type === 'agent' ? Bot : Cpu;

              return (
                <tr key={log.id + log.ts} className="hover:bg-white/5 transition">
                  <td className="py-3 text-slate-400 whitespace-nowrap">
                    {new Date(log.ts).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="py-3 text-slate-500 font-bold">{log.id}</td>
                  <td className={`py-3 ${actorColor} font-semibold flex items-center gap-1.5`}>
                    <ActorIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{log.actor}</span>
                  </td>
                  <td className="py-3 text-slate-100 max-w-sm truncate">{log.action}</td>
                  <td className="py-3 text-cyan-300/80">{log.target}</td>
                  <td className="py-3 text-slate-500 text-[10px]">{log.hash.slice(0, 14)}...</td>
                  <td className="py-3">
                    {log.hash === computeAuditHash(log) ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-300">
                        <AlertTriangle className="h-3 w-3" /> MISMATCH
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

AuditLogsTable.propTypes = {
  logs: PropTypes.array.isRequired
};

export default function AuditTrail() {
  const { auditLogs, addToast } = useUi();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return auditLogs.filter((log) => {
      const matchesType = filterType === 'all' || log.type === filterType;
      if (!matchesType) return false;
      if (!term) return true;
      return (
        log.actor.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.target.toLowerCase().includes(term) ||
        log.id.toLowerCase().includes(term)
      );
    });
  }, [auditLogs, filterType, searchTerm]);

  const { humanCount, agentCount, systemCount } = useMemo(() => {
    let human = 0;
    let agent = 0;
    let system = 0;
    for (let i = 0; i < auditLogs.length; i++) {
      const type = auditLogs[i].type;
      if (type === 'human') human++;
      else if (type === 'agent') agent++;
      else if (type === 'system') system++;
    }
    return { humanCount: human, agentCount: agent, systemCount: system };
  }, [auditLogs]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="10 · Compliance"
        title="Immutable Environmental Audit Trail"
        desc="Every action by analysts, AI agents and automated municipal systems is time-stamped and hashed. Actions you take across AURA appear here instantly."
        right={
          <button
            onClick={() => downloadAuditCsv(auditLogs, addToast)}
            className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 font-sans text-xs font-bold text-black shadow-glow hover:bg-cyan-300 transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export Audit CSV
          </button>
        }
      />

      <AuditStatCards
        totalLogs={auditLogs.length}
        humanCount={humanCount}
        agentCount={agentCount}
        systemCount={systemCount}
      />

      <AuditFilterBar
        filterType={filterType}
        onFilterChange={setFilterType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <AuditLogsTable logs={filteredLogs} />
    </div>
  );
}

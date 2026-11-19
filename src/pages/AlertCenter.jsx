import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ShieldAlert,
  CheckCircle2,
  Droplets,
  Bell,
  Power,
  Truck,
  Navigation,
  CloudRain,
  Zap,
  FileCheck,
  DollarSign,
  Plane,
  Users,
  Flame,
  Ban,
  CloudDrizzle,
  TrendingUp,
  Share2
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useAlerts } from '../context/AppContext';

const PLAYBOOK_ICONS = {
  Droplets,
  Bell,
  Power,
  Truck,
  Navigation,
  CloudRain,
  Zap,
  ShieldAlert,
  FileCheck,
  DollarSign,
  Plane,
  Users,
  Flame,
  Ban,
  CloudDrizzle
};

const SEVERITY_BADGE_CLASSES = {
  critical: 'border-rose-500/50 bg-rose-500/20 text-rose-200',
  high: 'border-orange-400/40 bg-orange-400/15 text-orange-200',
  medium: 'border-amber-400/30 bg-amber-400/10 text-amber-200'
};
const DEFAULT_SEVERITY_BADGE_CLASS = 'border-amber-400/30 bg-amber-400/10 text-amber-200';

function IncidentQueueList({ alerts, selectedAlertId, onSelectAlert }) {
  return (
    <div className="panel p-4 xl:col-span-2 space-y-3">
      <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
        <span className="label text-cyan-300">Active Incident Queue</span>
        <span className="font-mono text-xs text-slate-400">{alerts.length} Queued</span>
      </div>

      <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
        {alerts.map((alr) => {
          const isSelected = alr.id === selectedAlertId;
          const sevBadge = SEVERITY_BADGE_CLASSES[alr.severity] || DEFAULT_SEVERITY_BADGE_CLASS;

          return (
            <button
              type="button"
              key={alr.id}
              onClick={() => onSelectAlert(alr.id)}
              aria-pressed={isSelected}
              aria-label={`Select incident alert ${alr.id}: ${alr.title}`}
              className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer space-y-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                isSelected
                  ? 'border-cyan-400/60 bg-[#0c182c] shadow-[inset_0_0_0_1px_rgba(34,211,238,0.4)]'
                  : 'border-cyan-400/10 bg-[#060d1b] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-cyan-300">{alr.id}</span>
                <span className="text-slate-400 text-[10px]">{alr.timestamp}</span>
              </div>

              <div className="text-sm font-semibold text-white leading-snug">{alr.title}</div>
              <div className="text-xs text-slate-400 truncate">{alr.ward}</div>

              <div className="flex items-center justify-between pt-1 border-t border-cyan-400/10 font-mono text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded border uppercase text-[10px] font-bold ${sevBadge}`}
                >
                  {alr.severity}
                </span>
                <span className="text-slate-400 text-[10px]">AURA Score: {alr.score}/10</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

IncidentQueueList.propTypes = {
  alerts: PropTypes.array.isRequired,
  selectedAlertId: PropTypes.string.isRequired,
  onSelectAlert: PropTypes.func.isRequired
};

function PlaybookActionGrid({ playbook, selectedAlertId, onExecutePlaybook }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {playbook.map((action) => {
        const ActionIcon = PLAYBOOK_ICONS[action.icon] || Zap;
        return (
          <button
            key={action.id}
            onClick={() => onExecutePlaybook(selectedAlertId, action.id, action.label)}
            disabled={action.done}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition font-mono text-xs cursor-pointer ${
              action.done
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300 cursor-default'
                : 'border-cyan-400/20 bg-[#0c182c] text-slate-200 hover:border-cyan-400/60 hover:bg-cyan-400/10'
            }`}
          >
            <ActionIcon
              className={`h-4 w-4 shrink-0 ${action.done ? 'text-emerald-400' : 'text-cyan-400'}`}
            />
            <span className="truncate flex-1">{action.label}</span>
            {action.done && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

PlaybookActionGrid.propTypes = {
  playbook: PropTypes.array.isRequired,
  selectedAlertId: PropTypes.string.isRequired,
  onExecutePlaybook: PropTypes.func.isRequired
};

function IncidentDetailDossier({ selectedAlert, onBoostPriority, onExecutePlaybook }) {
  return (
    <div className="panel panel-corners p-6 xl:col-span-3 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-300">{selectedAlert.id}</span>
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-glow-red" />
            <span className="font-mono text-xs uppercase tracking-wider text-rose-400 font-bold">
              {selectedAlert.severity} HAZARD
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white leading-tight">
            {selectedAlert.title}
          </h2>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Location: <span className="text-slate-200">{selectedAlert.ward}</span>
          </p>
        </div>

        <button
          onClick={() => onBoostPriority(selectedAlert.id)}
          className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/20 px-3 py-1.5 font-mono text-xs text-rose-200 hover:bg-rose-500/30 transition cursor-pointer"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Boost Alert Priority
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/10">
          <span className="text-slate-400">Source Attribution:</span>
          <div className="text-sm font-semibold text-white mt-1">{selectedAlert.source}</div>
        </div>
        <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/10">
          <span className="text-slate-400">Exceedance Scale:</span>
          <div className="text-sm font-semibold text-rose-400 mt-1">{selectedAlert.exceedance}</div>
        </div>
      </div>

      <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/10 font-mono text-xs">
        <span className="text-slate-400">Demographic & Proximity Impact:</span>
        <div className="text-sm text-slate-200 mt-1">{selectedAlert.affected}</div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="label text-cyan-300">Automated Remediation Protocol</span>
            <h3 className="text-base font-bold text-white mt-0.5">Municipal Environmental SOP</h3>
          </div>
          <span className="font-mono text-xs text-emerald-400">AURA Agent Verified</span>
        </div>

        <PlaybookActionGrid
          playbook={selectedAlert.playbook}
          selectedAlertId={selectedAlert.id}
          onExecutePlaybook={onExecutePlaybook}
        />
      </div>

      <div className="rounded-lg border border-cyan-400/20 bg-[#0c182c] p-3 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">
          Current Playbook State:{' '}
          <strong className="text-white">
            {selectedAlert.activeAction || 'Awaiting Incident Commander Execution'}
          </strong>
        </span>
        <span className="text-cyan-300 flex items-center gap-1">
          <Share2 className="h-3.5 w-3.5" /> Synced to CPCB Gateway
        </span>
      </div>
    </div>
  );
}

IncidentDetailDossier.propTypes = {
  selectedAlert: PropTypes.object.isRequired,
  onBoostPriority: PropTypes.func.isRequired,
  onExecutePlaybook: PropTypes.func.isRequired
};

export default function AlertCenter() {
  const { alerts, executePlaybookAction, boostAlertPriority } = useAlerts();

  const [selectedAlertId, setSelectedAlertId] = useState(alerts[0]?.id || 'ALR-DEL-901');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const selectedAlert = useMemo(
    () => alerts.find((a) => a.id === selectedAlertId) || alerts[0],
    [alerts, selectedAlertId]
  );

  const filteredAlerts = useMemo(() => {
    if (filterSeverity === 'all') return alerts;
    return alerts.filter((a) => a.severity === filterSeverity);
  }, [alerts, filterSeverity]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="03 · Environmental Emergency Ops"
        title="Air Quality Alert & Incident Center"
        desc="Unified queue of atmospheric emergencies and hazardous air exceedances, scored by AURA AI agents and paired with automated municipal response playbooks."
        right={
          <div className="flex items-center gap-2">
            <span className="rounded border border-rose-500/40 bg-rose-500/10 px-3 py-1 font-mono text-xs text-rose-300">
              {alerts.filter((a) => a.severity === 'critical').length} Critical Incidents
            </span>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-slate-400 mr-1">Severity Filter:</span>
        {['all', 'critical', 'high', 'medium'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer uppercase ${
              filterSeverity === sev
                ? 'bg-cyan-400/15 border-cyan-400 text-cyan-200'
                : 'border-cyan-400/10 text-slate-400 hover:bg-white/5'
            }`}
          >
            {sev} ({sev === 'all' ? alerts.length : alerts.filter((a) => a.severity === sev).length}
            )
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <IncidentQueueList
          alerts={filteredAlerts}
          selectedAlertId={selectedAlertId}
          onSelectAlert={setSelectedAlertId}
        />
        <IncidentDetailDossier
          selectedAlert={selectedAlert}
          onBoostPriority={boostAlertPriority}
          onExecutePlaybook={executePlaybookAction}
        />
      </div>
    </div>
  );
}

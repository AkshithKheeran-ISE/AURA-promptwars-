import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  WARDS_DATA, 
  PRIORITY_ALERTS, 
  INITIAL_CITIZEN_REPORTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/airData';

const AppContext = createContext();

// Simple SHA-256 simulation for browser hash verification
function generateMockHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}${Math.abs(hash * 31).toString(16).padStart(8, '0')}${Math.abs(hash * 17).toString(16).padStart(8, '0')}`.slice(0, 40);
}

export const NAV_ITEMS = [
  { id: 'command', label: 'Command Center', icon: 'LayoutDashboard', badge: null },
  { id: 'map', label: 'Urban AQI Map', icon: 'Map', badge: null },
  { id: 'alerts', label: 'Alert Center', icon: 'AlertTriangle', badge: 8 },
  { id: 'emissions', label: 'Emission Defense', icon: 'Factory', badge: 4 },
  { id: 'health', label: 'Citizen Guidance', icon: 'HeartPulse', badge: null },
  { id: 'reports', label: 'Secure Reports', icon: 'FileText', badge: null },
  { id: 'ai', label: 'AURA AI Agents', icon: 'Bot', badge: null },
  { id: 'forecast', label: '30-Day Forecast', icon: 'CalendarDays', badge: null },
  { id: 'drones', label: 'Drone Missions', icon: 'Radio', badge: null },
  { id: 'audit', label: 'Audit Trail', icon: 'ShieldCheck', badge: null }
];

export function AppProvider({ children }) {
  // Hash-based navigation
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return NAV_ITEMS.some(item => item.id === hash) ? hash : 'command';
  };

  const [page, setPageState] = useState(getInitialPage);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedWardId, setSelectedWardId] = useState('wazirpur');
  
  // App State
  const [alerts, setAlerts] = useState(PRIORITY_ALERTS);
  const [citizenReports, setCitizenReports] = useState(INITIAL_CITIZEN_REPORTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState([]);
  const [droneMissionStatus, setDroneMissionStatus] = useState('IN FLIGHT');
  const [ledgerTampered, setLedgerTampered] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      setPageState(getInitialPage());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setPage = (newPage) => {
    window.location.hash = `/${newPage}`;
    setPageState(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast notification system
  const addToast = (title, body, tone = 'cyan') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, body, tone }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Log to immutable audit trail
  const logAudit = (actor, action, target, type = 'human') => {
    const newEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      ts: Date.now(),
      actor,
      action,
      target,
      type,
      hash: generateMockHash(`${actor}-${action}-${target}-${Date.now()}`)
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Selected ward full object
  const selectedWard = WARDS_DATA.find(w => w.id === selectedWardId) || WARDS_DATA[0];

  // Alert playbook actions
  const executePlaybookAction = (alertId, actionId, actionLabel) => {
    setAlerts(prev => prev.map(alr => {
      if (alr.id === alertId) {
        const updatedPlaybook = alr.playbook.map(act => act.id === actionId ? { ...act, done: true } : act);
        return { ...alr, playbook: updatedPlaybook, activeAction: actionLabel };
      }
      return alr;
    }));
    addToast('Action Executed', `${actionLabel} dispatched for ${alertId}`, 'green');
    logAudit('Analyst Akshith', `Dispatched playbook action: ${actionLabel}`, alertId, 'human');
  };

  const boostAlertPriority = (alertId) => {
    setAlerts(prev => prev.map(alr => alr.id === alertId ? { ...alr, score: Math.min(10, alr.score + 0.5), escalated: true } : alr));
    addToast('Priority Boosted', `Alert ${alertId} escalated to State Emergency Cell`, 'red');
    logAudit('Analyst Akshith', 'Elevated alert score to maximum priority', alertId, 'human');
  };

  // Citizen Reports Workflow & Cryptographic Ledger
  const addCitizenReport = (newReportData) => {
    const lastHash = citizenReports.length > 0 ? citizenReports[citizenReports.length - 1].hash : '0000000000000000';
    const newId = `REP-AURA-${Math.floor(8200 + Math.random() * 800)}`;
    const newHash = generateMockHash(`${lastHash}-${newId}-${newReportData.issue}-${Date.now()}`);

    const completeReport = {
      id: newId,
      issue: newReportData.issue,
      location: newReportData.location,
      reporter: newReportData.reporter || 'Anonymous Citizen',
      urgency: newReportData.urgency || 'High',
      lat: 28.65 + (Math.random() - 0.5) * 0.1,
      lng: 77.20 + (Math.random() - 0.5) * 0.1,
      timestamp: 'Just now',
      prevHash: lastHash,
      hash: newHash,
      stage: 1,
      statusText: 'Signed & Chained to Ledger'
    };

    setCitizenReports(prev => [...prev, completeReport]);
    addToast('Report Secured', `Report ${newId} hashed and chained to immutable ledger`, 'cyan');
    logAudit('Citizen Reporter', `Logged air hazard report: ${newReportData.issue.slice(0, 30)}...`, newId, 'human');
  };

  const advanceReportStage = (reportId) => {
    const stageMap = {
      1: { next: 2, text: 'Dispatched Field Team' },
      2: { next: 3, text: 'Inspection In Progress' },
      3: { next: 4, text: 'Remediation Done & Fine Levied' }
    };
    setCitizenReports(prev => prev.map(rep => {
      if (rep.id === reportId && rep.stage < 4) {
        const nextInfo = stageMap[rep.stage];
        return { ...rep, stage: nextInfo.next, statusText: nextInfo.text };
      }
      return rep;
    }));
    addToast('Workflow Advanced', `Report ${reportId} progressed to next operational tier`, 'green');
    logAudit('Municipal Officer', `Advanced report stage for ${reportId}`, reportId, 'human');
  };

  const simulateTamper = () => {
    if (citizenReports.length > 1) {
      setCitizenReports(prev => {
        const copy = [...prev];
        copy[1] = {
          ...copy[1],
          issue: '[TAMPERED BY ATTACKER] Altered smoke opacity reading to bypass fine',
          hash: '0000_TAMPERED_HASH_INVALID_CHAIN_BREAK_7721'
        };
        return copy;
      });
      setLedgerTampered(true);
      addToast('SECURITY ALARM', 'Cryptographic hash mismatch! Block #2 chain broken!', 'red');
      logAudit('Intrusion Detection (IDS)', 'Flagged unauthorized tampering attempt on citizen report ledger', 'REP-AURA-8102', 'system');
    }
  };

  const verifyLedger = () => {
    // Recalculate true valid hashes
    setCitizenReports(INITIAL_CITIZEN_REPORTS);
    setLedgerTampered(false);
    addToast('Ledger Validated', 'All SHA-256 blocks re-verified. 100% integrity restored.', 'green');
    logAudit('Validator Agent (AI)', 'Cryptographically verified all hash chains on reporting ledger', 'Ledger Root', 'agent');
  };

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        sidebarCollapsed,
        setSidebarCollapsed,
        commandPaletteOpen,
        setCommandPaletteOpen,
        selectedWard,
        selectedWardId,
        setSelectedWardId,
        alerts,
        executePlaybookAction,
        boostAlertPriority,
        citizenReports,
        addCitizenReport,
        advanceReportStage,
        simulateTamper,
        verifyLedger,
        ledgerTampered,
        auditLogs,
        logAudit,
        toasts,
        addToast,
        droneMissionStatus,
        setDroneMissionStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

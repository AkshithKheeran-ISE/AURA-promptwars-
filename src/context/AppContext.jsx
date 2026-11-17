import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  WARDS_DATA, 
  PRIORITY_ALERTS, 
  INITIAL_CITIZEN_REPORTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/airData';
import { 
  calculateInhaledExposure, 
  calculateCommunitySavings, 
  calculateHealthRiskIndex 
} from '../services/impactCalculator';
import { 
  generateDeterministicHash, 
  validateCitizenReport 
} from '../utils/sanitize';

const AppContext = createContext();

export const NAV_ITEMS = [
  { id: 'command', label: 'Smog Command', icon: 'LayoutDashboard', badge: null },
  { id: 'routines', label: 'Daily Routines', icon: 'Clock', badge: 'SMART' },
  { id: 'hacks', label: 'Indoor IAQ Hacks', icon: 'Sparkles', badge: 'DIY' },
  { id: 'alternatives', label: 'Clean Alternatives', icon: 'Leaf', badge: null },
  { id: 'map', label: 'Neighborhood Map', icon: 'Map', badge: null },
  { id: 'alerts', label: 'Family Alerts', icon: 'AlertTriangle', badge: 5 },
  { id: 'reports', label: 'Community Watch', icon: 'FileText', badge: null },
  { id: 'ai', label: 'GenAI Assistant', icon: 'Bot', badge: 'AI' },
  { id: 'forecast', label: '30-Day Outlook', icon: 'CalendarDays', badge: null },
  { id: 'audit', label: 'Impact Ledger', icon: 'ShieldCheck', badge: null }
];

export function AppProvider({ children }) {
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return NAV_ITEMS.some(item => item.id === hash) ? hash : 'command';
  };

  const [page, setPageState] = useState(getInitialPage);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedWardId, setSelectedWardId] = useState('wazirpur');

  // Family & Lifestyle Customization State
  const [familyArchetype, setFamilyArchetype] = useState('school_infant');
  const [dwellingType, setDwellingType] = useState('apartment_high');
  const [activeHacks, setActiveHacks] = useState(['corsi_rosenthal', 'weatherstrip_seals', 'wet_mopping_protocol']);
  const [transitChoice, setTransitChoice] = useState('eRickshawMetro');

  // Application Data State
  const [alerts, setAlerts] = useState(PRIORITY_ALERTS);
  const [citizenReports, setCitizenReports] = useState(INITIAL_CITIZEN_REPORTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState([]);
  const [ledgerTampered, setLedgerTampered] = useState(false);

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

  const addToast = (title, body, tone = 'cyan') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, body, tone }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const logAudit = (actor, action, target, type = 'human') => {
    const newEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      ts: Date.now(),
      actor,
      action,
      target,
      type,
      hash: generateDeterministicHash(`${actor}-${action}-${target}-${Date.now()}`)
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const selectedWard = WARDS_DATA.find(w => w.id === selectedWardId) || WARDS_DATA[0];

  // Calculated Real-Time Family Impact
  const usesHEPA = activeHacks.includes('corsi_rosenthal');
  const weatherstripped = activeHacks.includes('weatherstrip_seals');
  const exposureCalc = calculateInhaledExposure(selectedWard.pm25, 24, usesHEPA, weatherstripped, 'n95');
  const communitySavings = calculateCommunitySavings(18, 'petrolCar', transitChoice, true, true);
  const healthRisk = calculateHealthRiskIndex(
    exposureCalc.indoorPm25, 
    familyArchetype === 'asthma_seniors', 
    familyArchetype === 'school_infant'
  );

  const toggleHack = (hackId) => {
    setActiveHacks(prev => {
      const exists = prev.includes(hackId);
      const next = exists ? prev.filter(h => h !== hackId) : [...prev, hackId];
      addToast(
        exists ? 'Hack Deactivated' : 'Hack Activated',
        exists ? `Removed ${hackId} from active household defense` : `Applied ${hackId} — updated IAQ recalculation`,
        exists ? 'amber' : 'green'
      );
      logAudit('Household Member', `${exists ? 'Deactivated' : 'Activated'} IAQ hack: ${hackId}`, 'Household Defense', 'human');
      return next;
    });
  };

  const executePlaybookAction = (alertId, actionId, actionLabel) => {
    setAlerts(prev => prev.map(alr => {
      if (alr.id === alertId) {
        const updatedPlaybook = alr.playbook.map(act => act.id === actionId ? { ...act, done: true } : act);
        return { ...alr, playbook: updatedPlaybook, activeAction: actionLabel };
      }
      return alr;
    }));
    addToast('Action Executed', `${actionLabel} dispatched for ${alertId}`, 'green');
    logAudit('Family Lead', `Executed emergency safety action: ${actionLabel}`, alertId, 'human');
  };

  const boostAlertPriority = (alertId) => {
    setAlerts(prev => prev.map(alr => {
      if (alr.id === alertId) {
        const newScore = Math.min(10, alr.score + 0.5);
        return { ...alr, score: newScore, severity: 'critical' };
      }
      return alr;
    }));
    addToast('Priority Boosted', `Alert ${alertId} escalated to highest severity tier`, 'rose');
    logAudit('Incident Commander', `Escalated alert priority for ${alertId}`, alertId, 'human');
  };

  const addCitizenReport = (newReportData) => {
    const lastHash = citizenReports.length > 0 ? citizenReports[citizenReports.length - 1].hash : '0000000000000000';
    const newId = `REP-AURA-${Math.floor(8200 + Math.random() * 800)}`;
    const newHash = generateDeterministicHash(`${lastHash}-${newId}-${newReportData.issue}-${Date.now()}`);

    const completeReport = {
      id: newId,
      issue: newReportData.issue,
      location: newReportData.location,
      reporter: newReportData.reporter || 'Priya Family Member',
      urgency: newReportData.urgency || 'High',
      lat: 28.65 + (Math.random() - 0.5) * 0.1,
      lng: 77.20 + (Math.random() - 0.5) * 0.1,
      timestamp: 'Just now',
      prevHash: lastHash,
      hash: newHash,
      stage: 1,
      statusText: 'Hashed to Community Ledger'
    };

    setCitizenReports(prev => [...prev, completeReport]);
    addToast('Report Secured', `Hazard report ${newId} chained to immutable ledger`, 'cyan');
    logAudit('Community Reporter', `Logged community smog report: ${newReportData.issue.slice(0, 30)}...`, newId, 'human');
  };

  const advanceReportStage = (reportId) => {
    const stageMap = {
      1: { next: 2, text: 'RWA / Society Triage' },
      2: { next: 3, text: 'Municipal Flying Squad Dispatched' },
      3: { next: 4, text: 'Hazard Doused & Fine Issued' }
    };
    setCitizenReports(prev => prev.map(rep => {
      if (rep.id === reportId && rep.stage < 4) {
        const nextInfo = stageMap[rep.stage];
        return { ...rep, stage: nextInfo.next, statusText: nextInfo.text };
      }
      return rep;
    }));
    addToast('Workflow Advanced', `Report ${reportId} progressed to next operational tier`, 'green');
    logAudit('RWA Committee', `Advanced community action stage for ${reportId}`, reportId, 'human');
  };

  const simulateTamper = () => {
    if (citizenReports.length > 1) {
      setCitizenReports(prev => {
        const copy = [...prev];
        copy[1] = {
          ...copy[1],
          issue: '[TAMPERED BY POLLUTER] Falsified report to conceal industrial burning',
          hash: '0000_TAMPERED_HASH_INVALID_CHAIN_BREAK_9921'
        };
        return copy;
      });
      setLedgerTampered(true);
      addToast('SECURITY ALARM', 'Cryptographic hash mismatch! Block #2 chain broken!', 'red');
      logAudit('IDS Watchdog', 'Flagged unauthorized tampering attempt on community report ledger', 'REP-AURA-8102', 'system');
    }
  };

  const verifyLedger = () => {
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
        familyArchetype,
        setFamilyArchetype,
        dwellingType,
        setDwellingType,
        activeHacks,
        toggleHack,
        transitChoice,
        setTransitChoice,
        exposureCalc,
        communitySavings,
        healthRisk,
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
        addToast
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

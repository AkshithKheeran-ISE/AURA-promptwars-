import React, { createContext, useContext } from 'react';
import { useNavigationState } from '../hooks/useNavigationState';
import { useToastAuditState } from '../hooks/useToastAuditState';
import { useHouseholdState } from '../hooks/useHouseholdState';
import { useAlertsState } from '../hooks/useAlertsState';
import { useCitizenLedgerState } from '../hooks/useCitizenLedgerState';

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

/**
 * Root Application Context Provider orchestrating modular state domains.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function AppProvider({ children }) {
  const { toasts, setToasts, addToast, auditLogs, logAudit } = useToastAuditState();
  const nav = useNavigationState(NAV_ITEMS);
  const household = useHouseholdState(addToast, logAudit);
  const alertsState = useAlertsState(addToast, logAudit);
  const ledger = useCitizenLedgerState(addToast, logAudit);

  const value = {
    ...nav,
    ...household,
    ...alertsState,
    ...ledger,
    toasts,
    setToasts,
    addToast,
    auditLogs,
    logAudit
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to access AURA application context state and dispatchers.
 * @returns {object} Context state object
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

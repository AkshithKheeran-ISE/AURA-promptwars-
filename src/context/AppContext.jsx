import React, { createContext, useContext } from 'react';
import { useNavigationState } from '../hooks/useNavigationState';
import { useToastAuditState } from '../hooks/useToastAuditState';
import { useHouseholdState } from '../hooks/useHouseholdState';
import { useAlertsState } from '../hooks/useAlertsState';
import { useCitizenLedgerState } from '../hooks/useCitizenLedgerState';

export const UiContext = createContext(null);
export const HouseholdContext = createContext(null);
export const AlertsContext = createContext(null);
export const LedgerContext = createContext(null);
export const AppContext = createContext(null);

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
 * Composes domain-specific contexts to prevent cross-cutting render churn.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function AppProvider({ children }) {
  const { toasts, setToasts, addToast, auditLogs, logAudit } = useToastAuditState();
  const nav = useNavigationState(NAV_ITEMS);
  const household = useHouseholdState(addToast, logAudit);
  const alertsState = useAlertsState(addToast, logAudit);
  const ledger = useCitizenLedgerState(addToast, logAudit);

  const uiValue = { toasts, setToasts, addToast, auditLogs, logAudit, ...nav };

  const compositeValue = {
    ...uiValue,
    ...household,
    ...alertsState,
    ...ledger
  };

  return (
    <UiContext.Provider value={uiValue}>
      <HouseholdContext.Provider value={household}>
        <AlertsContext.Provider value={alertsState}>
          <LedgerContext.Provider value={ledger}>
            <AppContext.Provider value={compositeValue}>{children}</AppContext.Provider>
          </LedgerContext.Provider>
        </AlertsContext.Provider>
      </HouseholdContext.Provider>
    </UiContext.Provider>
  );
}

export const AppProviders = AppProvider;

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useUi() {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error('useUi must be used within an AppProvider');
  }
  return context;
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within an AppProvider');
  }
  return context;
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AppProvider');
  }
  return context;
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within an AppProvider');
  }
  return context;
}

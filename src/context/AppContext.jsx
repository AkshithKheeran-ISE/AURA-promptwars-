import React, { createContext, useContext, useMemo } from 'react';
import { useNavigationState } from '../hooks/useNavigationState';
import { useToastAuditState } from '../hooks/useToastAuditState';
import { useHouseholdState } from '../hooks/useHouseholdState';
import { useAlertsState } from '../hooks/useAlertsState';
import { useCitizenLedgerState } from '../hooks/useCitizenLedgerState';
import { NAV_ITEMS } from '../constants/navigation';

export { NAV_ITEMS } from '../constants/navigation';

/** @type {React.Context<any>} */
export const UiContext = createContext(null);
/** @type {React.Context<any>} */
export const HouseholdContext = createContext(null);
/** @type {React.Context<any>} */
export const AlertsContext = createContext(null);
/** @type {React.Context<any>} */
export const LedgerContext = createContext(null);

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

  const uiValue = useMemo(
    () => ({ toasts, setToasts, addToast, auditLogs, logAudit, ...nav }),
    [toasts, setToasts, addToast, auditLogs, logAudit, nav]
  );

  return (
    <UiContext.Provider value={uiValue}>
      <HouseholdContext.Provider value={household}>
        <AlertsContext.Provider value={alertsState}>
          <LedgerContext.Provider value={ledger}>{children}</LedgerContext.Provider>
        </AlertsContext.Provider>
      </HouseholdContext.Provider>
    </UiContext.Provider>
  );
}

export const AppProviders = AppProvider;

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

/**
 * Backward compatibility facade composing domain hooks.
 */
export function useApp() {
  const ui = useUi();
  const household = useHousehold();
  const alerts = useAlerts();
  const ledger = useLedger();

  return { ...ui, ...household, ...alerts, ...ledger };
}

import { useState } from 'react';
import { INITIAL_AUDIT_LOGS } from '../data/airData';
import { sha256 } from '../utils/sanitize';
import { TIMEOUTS } from '../constants';

/**
 * Manages toast notifications and tamper-evident audit trail entries.
 */
export function useToastAuditState() {
  const [toasts, setToasts] = useState([]);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  const addToast = (title, body, tone = 'cyan') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, title, body, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TIMEOUTS.TOAST_AUTO_DISMISS_MS);
  };

  const logAudit = (actor, action, target, type = 'human') => {
    const id = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
    const ts = Date.now();
    const newEntry = {
      id,
      ts,
      actor,
      action,
      target,
      type,
      hash: sha256(`${id}|${actor}|${action}|${target}|${ts}`)
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  return { toasts, setToasts, addToast, auditLogs, setAuditLogs, logAudit };
}

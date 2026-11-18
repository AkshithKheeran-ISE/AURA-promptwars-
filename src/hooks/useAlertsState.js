import { useState } from 'react';
import { PRIORITY_ALERTS } from '../data/airData';

/**
 * Manages neighborhood family alerts, playbook execution, and priority escalations.
 * @param {Function} addToast - Toast dispatcher
 * @param {Function} logAudit - Audit logger
 */
export function useAlertsState(addToast, logAudit) {
  const [alerts, setAlerts] = useState(PRIORITY_ALERTS);

  const executePlaybookAction = (alertId, actionId, actionLabel) => {
    setAlerts((prev) =>
      prev.map((alr) => {
        if (alr.id === alertId) {
          const updatedPlaybook = alr.playbook.map((act) =>
            act.id === actionId ? { ...act, done: true } : act
          );
          return { ...alr, playbook: updatedPlaybook, activeAction: actionLabel };
        }
        return alr;
      })
    );
    addToast('Action Executed', `${actionLabel} dispatched for ${alertId}`, 'green');
    logAudit('Family Lead', `Executed emergency safety action: ${actionLabel}`, alertId, 'human');
  };

  const boostAlertPriority = (alertId) => {
    setAlerts((prev) =>
      prev.map((alr) => {
        if (alr.id === alertId) {
          const newScore = Math.min(10, alr.score + 0.5);
          return { ...alr, score: newScore, severity: 'critical' };
        }
        return alr;
      })
    );
    addToast('Priority Boosted', `Alert ${alertId} escalated to highest severity tier`, 'rose');
    logAudit('Incident Commander', `Escalated alert priority for ${alertId}`, alertId, 'human');
  };

  return { alerts, executePlaybookAction, boostAlertPriority };
}

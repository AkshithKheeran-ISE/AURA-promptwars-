import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAlertsState } from '../../src/hooks/useAlertsState';

describe('useAlertsState hook', () => {
  it('initializes with default priority alerts', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useAlertsState(addToast, logAudit));
    expect(result.current.alerts.length).toBeGreaterThanOrEqual(4);
  });

  it('executes playbook action and logs audit side-effect', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useAlertsState(addToast, logAudit));
    const targetAlert = result.current.alerts[0];
    const targetAction = targetAlert.playbook[0];

    act(() => {
      result.current.executePlaybookAction(targetAlert.id, targetAction.id, targetAction.label);
    });

    const updated = result.current.alerts.find((a) => a.id === targetAlert.id);
    expect(updated.activeAction).toBe(targetAction.label);
    expect(updated.playbook.find((p) => p.id === targetAction.id).done).toBe(true);

    expect(addToast).toHaveBeenCalledWith(
      'Action Executed',
      expect.stringContaining(targetAlert.id),
      'green'
    );
    expect(logAudit).toHaveBeenCalledWith(
      'Family Lead',
      expect.stringContaining(targetAction.label),
      targetAlert.id,
      'human'
    );
  });

  it('boosts alert priority to critical and logs escalation', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useAlertsState(addToast, logAudit));
    const targetAlert = result.current.alerts[result.current.alerts.length - 1];

    act(() => {
      result.current.boostAlertPriority(targetAlert.id);
    });

    const updated = result.current.alerts.find((a) => a.id === targetAlert.id);
    expect(updated.severity).toBe('critical');
    expect(updated.score).toBeGreaterThanOrEqual(targetAlert.score);

    expect(addToast).toHaveBeenCalledWith(
      'Priority Boosted',
      expect.stringContaining(targetAlert.id),
      'rose'
    );
    expect(logAudit).toHaveBeenCalledWith(
      'Incident Commander',
      expect.stringContaining(targetAlert.id),
      targetAlert.id,
      'human'
    );
  });
});

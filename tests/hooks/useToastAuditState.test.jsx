import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToastAuditState } from '../../src/hooks/useToastAuditState';

describe('useToastAuditState hook', () => {
  it('adds toast and auto-dismisses after timeout', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToastAuditState());

    act(() => {
      result.current.addToast('Test Alert', 'Air quality changed', 'cyan');
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Test Alert');
    expect(result.current.toasts[0].tone).toBe('cyan');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.toasts.length).toBe(0);
    vi.useRealTimers();
  });

  it('prepends audit log with SHA-256 hash attestation', () => {
    const { result } = renderHook(() => useToastAuditState());
    const initialCount = result.current.auditLogs.length;

    act(() => {
      result.current.logAudit('Family Resident', 'Toggled Corsi filter', 'Air Filter', 'human');
    });

    expect(result.current.auditLogs.length).toBe(initialCount + 1);
    const latest = result.current.auditLogs[0];
    expect(latest.actor).toBe('Family Resident');
    expect(latest.action).toBe('Toggled Corsi filter');
    expect(latest.hash.length).toBe(64);
  });
});

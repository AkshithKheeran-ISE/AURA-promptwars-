import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHouseholdState } from '../../src/hooks/useHouseholdState';

describe('useHouseholdState hook', () => {
  it('initializes with default ward and archetype calculations', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useHouseholdState(addToast, logAudit));
    expect(result.current.selectedWard.id).toBe('wazirpur');
    expect(result.current.familyArchetype).toBe('school_infant');
    expect(result.current.activeHacks.length).toBeGreaterThanOrEqual(1);
    expect(result.current.exposureCalc.indoorPm25).toBeGreaterThan(0);
    expect(result.current.communitySavings.co2SavedKg).toBeGreaterThan(0);
  });

  it('switches ward and updates exposure metrics', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useHouseholdState(addToast, logAudit));

    act(() => {
      result.current.setSelectedWardId('anand_vihar');
    });

    expect(result.current.selectedWard.id).toBe('anand_vihar');
    expect(result.current.selectedWard.name).toContain('Anand Vihar');
  });

  it('toggles IAQ hack and recalculates exposure and audits change', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useHouseholdState(addToast, logAudit));
    const initialHEPA = result.current.activeHacks.includes('corsi_rosenthal');
    const initialIndoorPm = result.current.exposureCalc.indoorPm25;

    act(() => {
      result.current.toggleHack('corsi_rosenthal');
    });

    const nextHEPA = result.current.activeHacks.includes('corsi_rosenthal');
    expect(nextHEPA).toBe(!initialHEPA);
    expect(result.current.exposureCalc.indoorPm25).not.toBe(initialIndoorPm);

    expect(addToast).toHaveBeenCalled();
    expect(logAudit).toHaveBeenCalled();
  });
});

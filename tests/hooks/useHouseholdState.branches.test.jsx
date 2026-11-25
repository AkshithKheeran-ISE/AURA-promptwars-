import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHouseholdState } from '../../src/hooks/useHouseholdState';

describe('useHouseholdState branch coverage', () => {
  const setup = () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();
    const hook = renderHook(() => useHouseholdState(addToast, logAudit));
    return { ...hook, addToast, logAudit };
  };

  it('initializes with defaults and HEPA + weatherstrip active', () => {
    const { result } = setup();
    expect(result.current.selectedWardId).toBe('wazirpur');
    expect(result.current.familyArchetype).toBe('school_infant');
    expect(result.current.activeHacks).toContain('corsi_rosenthal');
    expect(result.current.exposureCalc).toBeDefined();
    expect(result.current.healthRisk).toBeDefined();
    expect(result.current.communitySavings).toBeDefined();
  });

  it('falls back to the first ward when the selected id is unknown', () => {
    const { result } = setup();
    act(() => {
      result.current.setSelectedWardId('no-such-ward');
    });
    expect(result.current.selectedWard.id).toBe('wazirpur');
    expect(result.current.selectedWardId).toBe('no-such-ward');
  });

  it('removes an active hack (exists branch) and re-adds it (missing branch)', () => {
    const { result, addToast, logAudit } = setup();

    act(() => {
      result.current.toggleHack('corsi_rosenthal');
    });
    expect(result.current.activeHacks).not.toContain('corsi_rosenthal');
    expect(addToast).toHaveBeenCalledWith(
      'Hack Deactivated',
      expect.stringContaining('Removed corsi_rosenthal'),
      'amber'
    );
    expect(logAudit).toHaveBeenCalledWith(
      'Household Member',
      expect.stringContaining('Deactivated IAQ hack: corsi_rosenthal'),
      'Household Defense',
      'human'
    );

    act(() => {
      result.current.toggleHack('corsi_rosenthal');
    });
    expect(result.current.activeHacks).toContain('corsi_rosenthal');
    expect(addToast).toHaveBeenCalledWith(
      'Hack Activated',
      expect.stringContaining('Applied corsi_rosenthal'),
      'green'
    );
    expect(logAudit).toHaveBeenCalledWith(
      'Household Member',
      expect.stringContaining('Activated IAQ hack: corsi_rosenthal'),
      'Household Defense',
      'human'
    );
  });

  it('adds a brand-new hack that was never active', () => {
    const { result } = setup();
    act(() => {
      result.current.toggleHack('hepa_purifier_pro');
    });
    expect(result.current.activeHacks).toContain('hepa_purifier_pro');
  });

  it('recalculates health risk for the asthma-seniors archetype', () => {
    const { result } = setup();
    // With HEPA active the indoor PM2.5 is so low the risk score floors at 1
    // for every archetype, so first remove the Corsi-Rosenthal hack.
    act(() => {
      result.current.toggleHack('corsi_rosenthal');
    });
    const infantRisk = result.current.healthRisk;
    expect(infantRisk.riskScore).toBeGreaterThan(1);

    act(() => {
      result.current.setFamilyArchetype('asthma_seniors');
    });
    expect(result.current.familyArchetype).toBe('asthma_seniors');
    expect(result.current.healthRisk).toBeDefined();
    // Senior weight 1.25 vs infant weight 1.2 changes the scaled score
    expect(result.current.healthRisk.riskScore).not.toBe(infantRisk.riskScore);
  });

  it('recalculates health risk for a commuter archetype (neither infant nor senior)', () => {
    const { result } = setup();
    act(() => {
      result.current.toggleHack('corsi_rosenthal');
      result.current.setFamilyArchetype('daily_commuter');
    });
    expect(result.current.familyArchetype).toBe('daily_commuter');
    expect(result.current.healthRisk).toBeDefined();
    expect(result.current.healthRisk.riskScore).toBeGreaterThan(1);
  });

  it('updates dwelling type and transit choice through their setters', () => {
    const { result } = setup();
    act(() => {
      result.current.setDwellingType('independent_house');
      result.current.setTransitChoice('metro');
    });
    expect(result.current.dwellingType).toBe('independent_house');
    expect(result.current.transitChoice).toBe('metro');
    expect(result.current.communitySavings).toBeDefined();
  });

  it('updates exposure when HEPA is removed and weatherstrip stays', () => {
    const { result } = setup();
    const before = result.current.exposureCalc.indoorPm25;
    act(() => {
      result.current.toggleHack('corsi_rosenthal');
    });
    expect(result.current.exposureCalc.indoorPm25).not.toBe(before);
  });
});

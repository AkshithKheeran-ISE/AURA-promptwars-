import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCitizenLedgerState } from '../../src/hooks/useCitizenLedgerState';
import { verifyLedgerIntegrity } from '../../src/utils/crypto';

describe('useCitizenLedgerState hook', () => {
  it('initializes with intact ledger hash chains', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useCitizenLedgerState(addToast, logAudit));
    expect(result.current.citizenReports.length).toBeGreaterThanOrEqual(4);
    expect(result.current.ledgerTampered).toBe(false);

    const integrity = verifyLedgerIntegrity(result.current.citizenReports);
    expect(integrity.valid).toBe(true);
  });

  it('adds a new report and chains hash to tip', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useCitizenLedgerState(addToast, logAudit));
    const initialCount = result.current.citizenReports.length;

    act(() => {
      result.current.addCitizenReport({
        issue: 'Illegal diesel generator emissions in sector 5',
        location: 'Wazirpur Industrial Area',
        reporter: 'Community Watchdog',
        urgency: 'High'
      });
    });

    expect(result.current.citizenReports.length).toBe(initialCount + 1);
    const tipReport = result.current.citizenReports[result.current.citizenReports.length - 1];
    expect(tipReport.issue).toContain('Illegal diesel generator');
    expect(tipReport.hash.length).toBe(64);

    const integrity = verifyLedgerIntegrity(result.current.citizenReports);
    expect(integrity.valid).toBe(true);
    expect(addToast).toHaveBeenCalledWith(
      'Report Secured',
      expect.stringContaining('chained to immutable ledger'),
      'cyan'
    );
    expect(logAudit).toHaveBeenCalled();
  });

  it('advances report workflow stage through RWA and Municipal tiers', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useCitizenLedgerState(addToast, logAudit));
    // Seed stages are 4, 3, 2, 1 — target the stage-1 report so the
    // advance is real and the assertions below always run.
    const target = result.current.citizenReports.find((r) => r.stage === 1);
    expect(target).toBeDefined();
    const targetId = target.id;

    act(() => {
      result.current.advanceReportStage(targetId);
    });

    const targetReport = result.current.citizenReports.find((r) => r.id === targetId);
    expect(targetReport.stage).toBe(2);
    expect(addToast).toHaveBeenCalledWith(
      'Workflow Advanced',
      expect.stringContaining(targetId),
      'green'
    );
  });

  it('simulates tamper, detects breach, and verifies zero-data-loss recovery with post-tamper submission preservation', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() => useCitizenLedgerState(addToast, logAudit));

    // 1. Simulate malicious tamper on block 2
    act(() => {
      result.current.simulateTamper();
    });

    expect(result.current.ledgerTampered).toBe(true);
    const brokenIntegrity = verifyLedgerIntegrity(result.current.citizenReports);
    expect(brokenIntegrity.valid).toBe(false);
    expect(addToast).toHaveBeenCalledWith(
      'SECURITY ALARM',
      expect.stringContaining('Block #2 chain broken'),
      'red'
    );

    // 2. Submit new citizen report while ledger is tampered (proves preservation of post-tamper user reports)
    act(() => {
      result.current.addCitizenReport({
        issue: 'Post-breach emergency observation',
        location: 'Anand Vihar',
        reporter: 'Citizen User',
        urgency: 'Critical'
      });
    });

    const postTamperReportId =
      result.current.citizenReports[result.current.citizenReports.length - 1].id;
    expect(postTamperReportId).toBeTruthy();

    // 3. Trigger consensus ledger repair
    act(() => {
      result.current.verifyLedger();
    });

    // 4. Assert full recovery, preserved report, and quarantine
    expect(result.current.ledgerTampered).toBe(false);
    const restoredIntegrity = verifyLedgerIntegrity(result.current.citizenReports);
    expect(restoredIntegrity.valid).toBe(true);

    const preservedReport = result.current.citizenReports.find((r) => r.id === postTamperReportId);
    expect(preservedReport).toBeDefined();
    expect(preservedReport.issue).toBe('Post-breach emergency observation');

    expect(result.current.quarantinedEvidence.length).toBeGreaterThan(0);
    expect(result.current.quarantinedEvidence[0].blockId).toBe('REP-AURA-8102');
    expect(addToast).toHaveBeenCalledWith(
      'Cryptographic Consensus Restored',
      expect.stringContaining('intact'),
      'green'
    );
  });
});

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAgentOrchestration } from '../../src/hooks/useAgentOrchestration';

describe('useAgentOrchestration hook', () => {
  it('initializes with system online banner and initial metrics', () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() =>
      useAgentOrchestration('school_infant', 280, addToast, logAudit)
    );

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].sender).toBe('sys');
    expect(result.current.isThinking).toBe(false);
    expect(result.current.agentMetrics.iaq_engineer.calls).toBe(0);
  });

  it('dispatches agent workflow: appends message, increments metrics, and clears thinking', async () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() =>
      useAgentOrchestration('school_infant', 280, addToast, logAudit)
    );

    await act(async () => {
      await result.current.handleSend('How do I build a DIY Corsi-Rosenthal box?');
    });

    expect(result.current.isThinking).toBe(false);
    expect(result.current.messages.length).toBe(3); // sys, user, aura
    const userMsg = result.current.messages[1];
    const auraMsg = result.current.messages[2];

    expect(userMsg.sender).toBe('user');
    expect(auraMsg.sender).toBe('aura');
    expect(auraMsg.agent).toBe('IAQEngineer');
    expect(auraMsg.text).toContain('CORSI-ROSENTHAL');
    expect(auraMsg.token.length).toBe(64);

    expect(result.current.agentMetrics.iaq_engineer.calls).toBe(1);
    expect(result.current.agentMetrics.iaq_engineer.status).toBe('EXECUTED');
    expect(addToast).toHaveBeenCalledWith(
      'Agent Task Verified',
      expect.stringContaining('IAQEngineer'),
      'cyan'
    );
    expect(logAudit).toHaveBeenCalled();
  });

  it('dispatches multi-agent consensus: appends consensus message with non-empty text and engaged agents', async () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();

    const { result } = renderHook(() =>
      useAgentOrchestration('school_infant', 280, addToast, logAudit)
    );

    await act(async () => {
      await result.current.handleRunConsensus();
    });

    expect(result.current.isThinking).toBe(false);
    const consensusMsg = result.current.messages[result.current.messages.length - 1];
    expect(consensusMsg.sender).toBe('aura');
    expect(consensusMsg.agent).toBe('AURA-CONSENSUS MESH');

    // This specifically tests the consensus bug fix: text must not be empty/undefined
    expect(consensusMsg.text).toBeTruthy();
    expect(consensusMsg.text).toContain('MULTI-AGENT HOUSEHOLD CONSENSUS');
    expect(consensusMsg.token.length).toBe(64);
    expect(consensusMsg.agents).toEqual(['IAQEngineer', 'PediatricShield', 'EcoAuditor']);

    expect(result.current.agentMetrics.iaq_engineer.calls).toBeGreaterThanOrEqual(1);
    expect(result.current.agentMetrics.pediatric_shield.calls).toBeGreaterThanOrEqual(1);
    expect(result.current.agentMetrics.eco_auditor.calls).toBeGreaterThanOrEqual(1);
    expect(addToast).toHaveBeenCalledWith(
      'Consensus Reached',
      expect.stringContaining('Attested consensus token'),
      'green'
    );
  });
});

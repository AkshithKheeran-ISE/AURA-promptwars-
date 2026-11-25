import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAgentOrchestration } from '../../src/hooks/useAgentOrchestration';

const mockWorkflow = vi.fn();
const mockConsensus = vi.fn();

vi.mock('../../src/services/aiService', () => ({
  orchestrateAgentWorkflow: (...args) => mockWorkflow(...args),
  orchestrateMultiAgentConsensus: (...args) => mockConsensus(...args),
  getAiServiceStatus: () => ({ engineName: 'Test Engine' })
}));

const WORKFLOW_SUCCESS = {
  agentId: 'iaq_engineer',
  agentName: 'IAQEngineer',
  role: 'Indoor Air Engineer',
  engine: 'Test Engine',
  text: 'Build a Corsi-Rosenthal box.',
  attestationToken: 'a'.repeat(64),
  durationMs: 12,
  trace: []
};

const CONSENSUS_SUCCESS = {
  consensusText: 'Ventilate briefly, then seal and filter.',
  consensusToken: 'b'.repeat(64),
  totalLatencyMs: 30,
  agentsEngaged: ['iaq_engineer', 'pediatric_shield', 'eco_auditor']
};

describe('useAgentOrchestration branch coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWorkflow.mockResolvedValue(WORKFLOW_SUCCESS);
    mockConsensus.mockResolvedValue(CONSENSUS_SUCCESS);
  });

  const setup = () => {
    const addToast = vi.fn();
    const logAudit = vi.fn();
    const hook = renderHook(() => useAgentOrchestration('school_infant', 280, addToast, logAudit));
    return { ...hook, addToast, logAudit };
  };

  it('falls back to a safety message when the agent workflow throws', async () => {
    mockWorkflow.mockRejectedValue(new Error('model down'));
    const { result, addToast } = setup();

    await act(async () => {
      await result.current.handleSend('Build a DIY purifier');
    });

    expect(result.current.isThinking).toBe(false);
    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.sender).toBe('aura');
    expect(last.agent).toBe('AURA-CORE');
    expect(last.engine).toBe('System Safety Fallback');
    expect(last.text).toContain('model down');
    expect(addToast).not.toHaveBeenCalledWith(
      'Agent Task Verified',
      expect.anything(),
      expect.anything()
    );
  });

  it('toasts Consensus Interrupted when consensus throws', async () => {
    mockConsensus.mockRejectedValue(new Error('quorum lost'));
    const { result, addToast } = setup();

    await act(async () => {
      await result.current.handleRunConsensus();
    });

    expect(result.current.isThinking).toBe(false);
    expect(addToast).toHaveBeenCalledWith(
      'Consensus Interrupted',
      expect.stringContaining('offline safety cache'),
      'rose'
    );
    expect(result.current.messages).toHaveLength(1); // only the sys banner
  });

  it('ignores blank sends without calling the agent mesh', async () => {
    const { result } = setup();

    await act(async () => {
      await result.current.handleSend('   ');
    });

    expect(mockWorkflow).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.isThinking).toBe(false);
  });

  it('ignores a consensus run while a send is executing', async () => {
    let resolveWorkflow;
    mockWorkflow.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveWorkflow = resolve;
        })
    );
    const { result, addToast } = setup();

    let sendPromise;
    act(() => {
      sendPromise = result.current.handleSend('How do I ventilate?');
    });
    expect(result.current.isThinking).toBe(true);

    await act(async () => {
      await result.current.handleRunConsensus();
    });
    expect(addToast).not.toHaveBeenCalledWith(
      'Consensus Dispatched',
      expect.anything(),
      expect.anything()
    );
    expect(mockConsensus).not.toHaveBeenCalled();

    await act(async () => {
      resolveWorkflow(WORKFLOW_SUCCESS);
      await sendPromise;
    });
    expect(result.current.isThinking).toBe(false);
  });
});

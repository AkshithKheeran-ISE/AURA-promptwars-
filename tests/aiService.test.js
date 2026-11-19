import { describe, it, expect } from 'vitest';
import {
  queryAiAssistant,
  orchestrateAgentWorkflow,
  orchestrateMultiAgentConsensus,
  resolveAgentIntent,
  getAiServiceStatus
} from '../src/services/aiService';

describe('AURA Verifiable GenAI & Multi-Agent Orchestration Service', () => {
  describe('Service Status & Secure Configuration', () => {
    it('returns valid AI service configuration status', () => {
      const status = getAiServiceStatus();
      expect(status).toHaveProperty('isLiveConfigured');
      expect(status).toHaveProperty('engineName');
      expect(status).toHaveProperty('provider');
      expect(typeof status.isLiveConfigured).toBe('boolean');
    });

    it('executes backward-compatible queryAiAssistant wrapper', async () => {
      const res = await queryAiAssistant('Corsi Rosenthal box for 200 sq ft');
      expect(res).toHaveProperty('text');
      expect(res).toHaveProperty('engine');
      expect(res).toHaveProperty('agent');
      expect(res).toHaveProperty('attestationToken');
      expect(res.attestationToken.length).toBe(64);
    });
  });

  describe('Intent Resolution & Task Routing', () => {
    it('correctly maps diverse query semantics to specialized agents', () => {
      expect(resolveAgentIntent('DIY Corsi Rosenthal box filter')).toBe('iaq_engineer');
      expect(resolveAgentIntent('Infant respiratory protection protocol')).toBe('pediatric_shield');
      expect(resolveAgentIntent('Thermal boundary inversion window')).toBe('meteo_forecaster');
      expect(resolveAgentIntent('Calculate petrol car vs metro savings')).toBe('eco_auditor');
      expect(resolveAgentIntent('Verify community report ledger hash')).toBe('community_watch');
      expect(resolveAgentIntent('General daily schedule for school commute')).toBe(
        'family_advisor'
      );
    });

    it('honors explicit preferredAgentId override regardless of query keywords', () => {
      expect(resolveAgentIntent('general query text', 'iaq_engineer')).toBe('iaq_engineer');
      expect(resolveAgentIntent('corsi box text', 'community_watch')).toBe('community_watch');
    });
  });

  describe('Verifiable Agent Execution Contracts', () => {
    it('executes IAQEngineer and generates valid SHA-256 attestation token and execution trace', async () => {
      const res = await orchestrateAgentWorkflow('How do I build a DIY Corsi Rosenthal box?');
      expect(res.agentId).toBe('iaq_engineer');
      expect(res.agentName).toBe('IAQEngineer');
      expect(res.text).toContain('CORSI-ROSENTHAL');
      expect(res.text).toContain('MERV-13');
      expect(res.text).toContain('CADR');
      expect(res.attestationToken.length).toBe(64);
      expect(/^[0-9a-f]{64}$/.test(res.attestationToken)).toBe(true);

      expect(res.trace).toBeInstanceOf(Array);
      expect(res.trace.length).toBeGreaterThanOrEqual(4);
      const stepNames = res.trace.map((s) => s.step);
      expect(stepNames).toContain('INTENT_RESOLUTION');
      expect(stepNames).toContain('INPUT_SANITIZATION');
      expect(stepNames).toContain('ATTESTATION_GENERATION');
    });

    it('executes PediatricShield with child and senior physiological airway protocols', async () => {
      const res = await orchestrateAgentWorkflow(
        'What protection protocol for infant and asthmatic senior?'
      );
      expect(res.agentId).toBe('pediatric_shield');
      expect(res.agentName).toBe('PediatricShield');
      expect(res.role).toContain('Bronchial Protection');
      expect(res.attestationToken).toMatch(/^[0-9a-f]{64}$/);
      expect(res.trace).toBeInstanceOf(Array);
      expect(res.trace.length).toBeGreaterThanOrEqual(4);

      // Verify token differs per distinct prompt
      const res2 = await orchestrateAgentWorkflow('Asthma senior breathing difficulty');
      expect(res2.attestationToken).toMatch(/^[0-9a-f]{64}$/);
      expect(res2.attestationToken).not.toBe(res.attestationToken);
    });

    it('executes MeteoForecaster with boundary layer inversion calculations', async () => {
      const res = await orchestrateAgentWorkflow(
        'When should I open my window for cross ventilation inversion?'
      );
      expect(res.agentId).toBe('meteo_forecaster');
      expect(res.text).toContain('13:30 and 15:30');
      expect(res.text).toMatch(/inversion/i);
      expect(res.attestationToken.length).toBe(64);
    });

    it('executes EcoAuditor with exact explainable emissions & cost formulas', async () => {
      const res = await orchestrateAgentWorkflow('Taking metro transit vs car commute emissions');
      expect(res.agentId).toBe('eco_auditor');
      expect(res.text).toContain('CO2');
      expect(res.text).toContain('Fuel Savings');
      expect(res.attestationToken.length).toBe(64);
    });

    it('executes CommunityWatch with SHA-256 ledger and escalation workflow', async () => {
      const res = await orchestrateAgentWorkflow('How does citizen ledger verification work?');
      expect(res.agentId).toBe('community_watch');
      expect(res.text).toContain('SHA-256');
      expect(res.text).toContain('Merkle');
      expect(res.attestationToken.length).toBe(64);
    });
  });

  describe('Multi-Agent Consensus Orchestration', () => {
    it('coordinates parallel consensus from 3 specialized agents with signed consensus token', async () => {
      const consensus = await orchestrateMultiAgentConsensus({ familyArchetype: 'school_infant' });
      expect(consensus.agentsEngaged).toEqual(['IAQEngineer', 'PediatricShield', 'EcoAuditor']);
      expect(consensus.consensusText).toContain('MULTI-AGENT HOUSEHOLD CONSENSUS');
      expect(consensus.consensusText).toContain('IAQEngineer');
      expect(consensus.consensusText).toContain('PediatricShield');
      expect(consensus.consensusText).toContain('EcoAuditor');
      expect(consensus.consensusToken.length).toBe(64);
      expect(consensus.totalLatencyMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Input Sanitization & Injection Defense', () => {
    it('neutralizes HTML tags and dangerous scripts in prompt payloads', async () => {
      const maliciousPrompt =
        '<script>alert("hack")</script><style>body{display:none}</style>How to protect against smog?';
      const res = await orchestrateAgentWorkflow(maliciousPrompt);
      expect(res.text).not.toContain('<script>');
      expect(res.attestationToken.length).toBe(64);
    });

    it('gracefully handles empty, null, or malformed prompt payloads', async () => {
      const emptyRes = await orchestrateAgentWorkflow('');
      expect(emptyRes.agentId).toBe('family_advisor');
      expect(emptyRes.attestationToken.length).toBe(64);

      const nullRes = await orchestrateAgentWorkflow(null);
      expect(nullRes.agentId).toBe('family_advisor');
      expect(nullRes.attestationToken.length).toBe(64);
    });

    it('generates distinct cryptographic attestation tokens for different queries', async () => {
      const res1 = await orchestrateAgentWorkflow('Corsi-Rosenthal box filter specs');
      const res2 = await orchestrateAgentWorkflow('Elderly asthma airway safety directives');
      expect(res1.attestationToken).not.toBe(res2.attestationToken);
    });

    it('seamlessly integrates live Gemini proxy completions when available', async () => {
      const mockFetch = (url) => {
        if (url === '/api/gemini') {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              success: true,
              text: 'Custom AI recommendation for urban smog defense.',
              model: 'gemini-2.0-flash',
              latencyMs: 95
            })
          });
        }
        return Promise.reject(new Error('Unknown url'));
      };

      const originalFetch = globalThis.fetch;
      globalThis.fetch = mockFetch;

      try {
        const res = await orchestrateAgentWorkflow('What is the best winter air routine?');
        expect(res.text).toBe('Custom AI recommendation for urban smog defense.');
        expect(res.engine).toContain('Gemini 2.0 Flash');
        expect(
          res.trace.some((t) => t.step === 'SERVER_PROXY_DISPATCH' && t.status === 'SUCCESS')
        ).toBe(true);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it('verifies complete diagnostic trace schema for every agent task execution', async () => {
      const res = await orchestrateAgentWorkflow('Test prompt for trace verification');
      expect(Array.isArray(res.trace)).toBe(true);
      expect(res.trace.length).toBeGreaterThanOrEqual(3);
      res.trace.forEach((step) => {
        expect(step).toHaveProperty('step');
        expect(step).toHaveProperty('status');
        expect(step).toHaveProperty('detail');
        expect(typeof step.step).toBe('string');
        expect(typeof step.status).toBe('string');
        expect(typeof step.detail).toBe('string');
      });
    });
  });
});

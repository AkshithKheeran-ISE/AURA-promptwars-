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
      expect(res.text).toContain('PediatricShield');
      expect(res.text).toContain('Infants breathe 40–50 bpm');
      expect(res.text).toContain('wet-mop');
      expect(res.attestationToken.length).toBe(64);
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
  });
});

import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  escapeHtml,
  stripHtmlTags,
  sha256,
  verifyLedgerIntegrity,
  repairLedgerChain,
  computeBlockHash,
  computeMerkleRoot
} from '../src/utils/sanitize';
import {
  calculateInhaledExposure,
  calculateCommunitySavings,
  calculateHealthRiskIndex
} from '../src/services/impactCalculator';
import {
  queryAiAssistant,
  orchestrateAgentWorkflow,
  orchestrateMultiAgentConsensus,
  resolveAgentIntent
} from '../src/services/aiService';
import { NAV_ITEMS } from '../src/context/AppContext';

describe('Comprehensive Edge Cases & Resilience Test Suite', () => {
  describe('Input Sanitization & Boundary Handling', () => {
    it('handles null, undefined, numbers, and empty input safely', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(12345)).toBe('');
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(stripHtmlTags(null)).toBe('');
    });

    it('handles excessively long strings beyond max allowable length', () => {
      const veryLong = 'a'.repeat(5000);
      const sanitized = sanitizeInput(veryLong, 500);
      expect(sanitized.length).toBe(500);
    });

    it('neutralizes malicious XSS script injections and inline event handlers', () => {
      const malicious = '<script>alert("xss")</script><img src=x onerror=alert(1) />Click me';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('onerror=');
      expect(clean).toContain('Click me');
    });

    it('escapes dangerous HTML characters into safe HTML entities', () => {
      const dangerous = '<div class="test" data-id=\'1\'>& "test" `eval()`</div>';
      const escaped = escapeHtml(dangerous);
      expect(escaped).toContain('&lt;div');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;test&quot;');
      expect(escaped).toContain('&#x60;eval()&#x60;');
    });
  });

  describe('Impact Calculator Resilience & Bounds', () => {
    it('handles NaN, negative, and infinite ambient PM2.5 values safely', () => {
      const resNaN = calculateInhaledExposure(NaN, 24);
      expect(resNaN.standardInhaledMicrograms).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(resNaN.standardInhaledMicrograms)).toBe(true);

      const resNegative = calculateInhaledExposure(-50, -5);
      expect(resNegative.standardInhaledMicrograms).toBe(0);
      expect(resNegative.reductionMicrograms).toBe(0);

      const resHuge = calculateInhaledExposure(999999, 100);
      expect(resHuge.indoorPm25).toBeLessThanOrEqual(1000);
      expect(Number.isFinite(resHuge.standardInhaledMicrograms)).toBe(true);
    });

    it('handles extreme and negative community commute distances', () => {
      const resNegative = calculateCommunitySavings(-100);
      expect(resNegative.co2SavedKg).toBe(0);
      expect(resNegative.totalFinancialSavingsInr).toBe(0);

      const resNaN = calculateCommunitySavings(NaN);
      expect(resNaN.co2SavedKg).toBe(0);

      const resZero = calculateCommunitySavings(0);
      expect(resZero.co2SavedKg).toBe(0);
      expect(resZero.totalFinancialSavingsInr).toBe(0);
    });

    it('handles unexpected transit modes and missing inputs without throwing', () => {
      const resUnknown = calculateCommunitySavings(25, 'hyperspace_capsule', 'teleportation');
      expect(Number.isFinite(resUnknown.co2SavedKg)).toBe(true);
      expect(Number.isFinite(resUnknown.totalFinancialSavingsInr)).toBe(true);
    });

    it('is prototype-safe and cleanly defaults for inherited object property names', () => {
      const prototypeAttack = calculateInhaledExposure(
        100,
        8,
        false,
        false,
        'toString',
        'constructor'
      );
      expect(Number.isFinite(prototypeAttack.standardInhaledMicrograms)).toBe(true);
      expect(Number.isFinite(prototypeAttack.optimizedInhaledMicrograms)).toBe(true);
      expect(prototypeAttack.percentageReduction).toBeGreaterThanOrEqual(0);

      const protoTransit = calculateCommunitySavings(20, 'constructor', 'toString');
      expect(Number.isFinite(protoTransit.co2SavedKg)).toBe(true);
      expect(Number.isFinite(protoTransit.totalFinancialSavingsInr)).toBe(true);
    });

    it('evaluates health risk index across normal, boundary, and extreme AQI levels', () => {
      const lowRisk = calculateHealthRiskIndex(15, false, false);
      expect(lowRisk.riskTier).toBe('Minimal Impact');

      const boundaryRisk = calculateHealthRiskIndex(100, false, false);
      expect(boundaryRisk.riskScore).toBeGreaterThan(0);

      const severeRisk = calculateHealthRiskIndex(450, true, true);
      expect(severeRisk.riskTier).toBe('Severe Environmental Hazard');

      const extremeOverflow = calculateHealthRiskIndex(9999, true, true);
      expect(extremeOverflow.riskScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Cryptographic Ledger Tamper & Zero-Data-Loss Recovery', () => {
    it('accurately detects corrupted hashes and tampered block payloads', () => {
      const genesis = {
        id: 'CR-001',
        issue: 'Biomass burning',
        location: 'Anand Vihar',
        reporter: 'Citizen 1',
        urgency: 'High',
        prevHash: '0'.repeat(64)
      };
      genesis.hash = computeBlockHash(genesis, genesis.prevHash);

      const block2 = {
        id: 'CR-002',
        issue: 'Diesel genset smoke',
        location: 'Okhla',
        reporter: 'Citizen 2',
        urgency: 'Medium',
        prevHash: genesis.hash
      };
      block2.hash = computeBlockHash(block2, block2.prevHash);

      const chain = [genesis, block2];
      expect(verifyLedgerIntegrity(chain).valid).toBe(true);

      const tamperedChain = [
        genesis,
        { ...block2, issue: '[TAMPERED] All clear no smoke detected' }
      ];
      const checkTamper = verifyLedgerIntegrity(tamperedChain);
      expect(checkTamper.valid).toBe(false);
      expect(checkTamper.brokenIndex).toBe(1);
    });

    it('surgically repairs tampered blocks using canonical store without losing user records', () => {
      const genesis = {
        id: 'CR-101',
        issue: 'Tire burning',
        location: 'Wazirpur',
        reporter: 'Monitor A',
        urgency: 'Critical',
        prevHash: '0'.repeat(64)
      };
      genesis.hash = computeBlockHash(genesis, genesis.prevHash);

      const canonicalMap = new Map();
      canonicalMap.set('CR-101', { ...genesis });

      const tampered = [{ ...genesis, issue: '[HACKED] No pollution' }];
      expect(verifyLedgerIntegrity(tampered).valid).toBe(false);

      const recovery = repairLedgerChain(tampered, canonicalMap);
      expect(recovery.success).toBe(true);
      expect(recovery.restoredCount).toBe(1);
      expect(recovery.preservedCount).toBe(1);
      expect(recovery.repairedChain[0].issue).toBe('Tire burning');
      expect(verifyLedgerIntegrity(recovery.repairedChain).valid).toBe(true);
    });

    it('computes consistent Merkle root across empty, single, and multiple block sets', () => {
      expect(computeMerkleRoot([])).toBe('0'.repeat(64));

      const h1 = sha256('block1');
      const h2 = sha256('block2');
      const root = computeMerkleRoot([h1, h2]);
      expect(root).toHaveLength(64);
      expect(root).toBe(sha256(h1 + h2));
    });
  });

  describe('GenAI Deterministic Protocol & Timeout Fallbacks', () => {
    it('falls back seamlessly to domain-verified clinical logic on query', async () => {
      const response = await queryAiAssistant('How do I build a DIY Corsi-Rosenthal box?');
      expect(response).toBeDefined();
      expect(response.text).toContain('CORSI-ROSENTHAL');
      expect(response.attestationToken).toHaveLength(64);
      expect(response.agent).toBe('IAQEngineer');
    });

    it('resolves semantic agent intents deterministically across diverse domains', () => {
      const pediatricId = resolveAgentIntent(
        'My 3 year old child has coughing spells in morning smog'
      );
      expect(pediatricId).toBe('pediatric_shield');

      const routineId = resolveAgentIntent(
        'What is the best time for morning jog or walk during smog?'
      );
      expect(routineId).toBe('family_advisor');

      const auditId = resolveAgentIntent(
        'Calculate the ROI and carbon savings for electric heat pumps'
      );
      expect(auditId).toBe('eco_auditor');
    });

    it('executes orchestrateAgentWorkflow with verifiable execution trace', async () => {
      const trace = await orchestrateAgentWorkflow('Build Corsi box CADR');
      expect(trace).toBeDefined();
      expect(trace.attestationToken).toHaveLength(64);
      expect(trace.agentId).toBe('iaq_engineer');
      expect(trace.text).toBeDefined();
    });

    it('generates multi-agent consensus attestation tokens', async () => {
      const consensus = await orchestrateMultiAgentConsensus({ familyArchetype: 'school_infant' });
      expect(consensus).toBeDefined();
      expect(consensus.consensusToken).toHaveLength(64);
      expect(consensus.agentsEngaged.length).toBeGreaterThanOrEqual(2);
      expect(consensus.consensusText).toBeDefined();
    });
  });

  describe('Navigation Route Integrity', () => {
    it('verifies all 10 core routes are defined with unique IDs and valid configuration', () => {
      expect(NAV_ITEMS.length).toBe(10);
      const uniqueIds = new Set(NAV_ITEMS.map((item) => item.id));
      expect(uniqueIds.size).toBe(10);

      const expectedRoutes = [
        'command',
        'routines',
        'hacks',
        'alternatives',
        'map',
        'alerts',
        'reports',
        'ai',
        'forecast',
        'audit'
      ];

      expectedRoutes.forEach((route) => {
        const found = NAV_ITEMS.find((item) => item.id === route);
        expect(found).toBeDefined();
        expect(typeof found.label).toBe('string');
        expect(found.label.length).toBeGreaterThan(0);
      });
    });
  });
});

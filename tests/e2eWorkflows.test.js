import { describe, it, expect } from 'vitest';
import {
  validateCitizenReport,
  computeBlockHash,
  verifyLedgerIntegrity,
  repairLedgerChain,
  computeMerkleRoot
} from '../src/utils/sanitize';
import {
  calculateInhaledExposure,
  calculateCommunitySavings,
  calculateHealthRiskIndex
} from '../src/services/impactCalculator';
import { generatePersonalizedGuidance, DAILY_ROUTINE_SLOTS } from '../src/services/routineEngine';
import {
  orchestrateAgentWorkflow,
  orchestrateMultiAgentConsensus
} from '../src/services/aiService';
import { INITIAL_CITIZEN_REPORTS, WARDS_DATA } from '../src/data/airData';

describe('AURA End-to-End User Journeys & Critical Workflows', () => {
  describe('Journey 1: Immutable Hazard Reporting & Zero-Data-Loss Recovery', () => {
    it('successfully processes full lifecycle: submission -> chaining -> tamper isolation -> consensus repair with full user data preservation', () => {
      // Step 1: Initialize baseline ledger and canonical store
      const chain = [...INITIAL_CITIZEN_REPORTS];
      const canonicalStore = {};
      INITIAL_CITIZEN_REPORTS.forEach((b) => {
        canonicalStore[b.id] = { ...b };
      });

      // Step 2: Resident submits a new hazard report (Block 5)
      const rawUserReport1 = {
        location: 'Wazirpur Industrial Area Gate 3',
        issue: 'Illegal nocturnal smelting stack plume without wet scrubbers',
        reporter: 'Citizen RWA Lead',
        urgency: 'Critical'
      };

      const validation1 = validateCitizenReport(rawUserReport1);
      expect(validation1.isValid).toBe(true);

      const block5 = {
        id: 'REP-AURA-8201',
        ...validation1.sanitized,
        lat: 28.698,
        lng: 77.165,
        timestamp: 'Just now',
        stage: 1,
        statusText: 'Hashed to Community Ledger',
        prevHash: chain[chain.length - 1].hash
      };
      block5.hash = computeBlockHash(block5, block5.prevHash);
      chain.push(block5);
      canonicalStore[block5.id] = { ...block5 };

      // Step 3: Resident submits a second report (Block 6)
      const rawUserReport2 = {
        location: 'Anand Vihar Railway Bypass',
        issue: 'Uncovered high-capacity cement trucks spreading fine particulate clouds',
        reporter: 'Cyclist Priya',
        urgency: 'High'
      };

      const validation2 = validateCitizenReport(rawUserReport2);
      expect(validation2.isValid).toBe(true);

      const block6 = {
        id: 'REP-AURA-8202',
        ...validation2.sanitized,
        lat: 28.65,
        lng: 77.31,
        timestamp: 'Just now',
        stage: 1,
        statusText: 'Hashed to Community Ledger',
        prevHash: block5.hash
      };
      block6.hash = computeBlockHash(block6, block6.prevHash);
      chain.push(block6);
      canonicalStore[block6.id] = { ...block6 };

      expect(chain.length).toBe(6);
      expect(verifyLedgerIntegrity(chain).valid).toBe(true);

      // Step 4: Adversary maliciously corrupts Block 2 (index 1) to erase evidence
      chain[1].issue = '[TAMPERED] No emissions observed here';
      chain[1].hash = '000000000000000000000000000000000000000000000000000000000000dead';

      // Step 5: Ledger watchdog detects tamper and flags exact index
      const auditResult = verifyLedgerIntegrity(chain);
      expect(auditResult.valid).toBe(false);
      expect(auditResult.brokenIndex).toBe(1);

      // Step 6: Safe recovery executes - must restore Block 2 AND preserve Blocks 5 and 6
      const recovery = repairLedgerChain(chain, canonicalStore);
      expect(recovery.success).toBe(true);
      expect(recovery.restoredCount).toBe(1);
      expect(recovery.preservedCount).toBe(6);
      expect(recovery.quarantinedEvidence.length).toBe(1);
      expect(recovery.quarantinedEvidence[0].blockId).toBe('REP-AURA-8102');

      // Step 7: Validate repaired chain integrity and data preservation
      const repairedChain = recovery.repairedChain;
      expect(verifyLedgerIntegrity(repairedChain).valid).toBe(true);
      expect(repairedChain[1].issue).toBe(
        'Dense Chemical Fumes & Black Smoke from Fabrication Chimney'
      );
      expect(repairedChain[4].id).toBe('REP-AURA-8201');
      expect(repairedChain[4].issue).toBe(
        'Illegal nocturnal smelting stack plume without wet scrubbers'
      );
      expect(repairedChain[5].id).toBe('REP-AURA-8202');
      expect(repairedChain[5].reporter).toBe('Cyclist Priya');

      // Step 8: Verify dynamic Merkle Root updates
      const merkleRoot = computeMerkleRoot(repairedChain.map((b) => b.hash));
      expect(merkleRoot.length).toBe(64);
    });
  });

  describe('Journey 2: Family Archetype & Smog Inversion Defense', () => {
    it('calculates personalized pediatric exposure protection for infant in Wazirpur hotspot', () => {
      const wazirpur = WARDS_DATA.find((w) => w.id === 'wazirpur');
      expect(wazirpur).toBeDefined();

      // Ambient PM2.5 in Wazirpur is 298 µg/m³
      const baseline = calculateInhaledExposure(
        wazirpur.pm25,
        24,
        false,
        false,
        'none',
        'school_infant'
      );
      const shielded = calculateInhaledExposure(
        wazirpur.pm25,
        24,
        true, // Corsi-Rosenthal HEPA
        true, // Weatherstripped windows
        'n95',
        'school_infant'
      );

      expect(baseline.standardInhaledMicrograms).toBe(2503); // 298 * 24 * 0.35
      expect(shielded.indoorPm25).toBeLessThanOrEqual(15);
      expect(shielded.percentageReduction).toBeGreaterThanOrEqual(95);

      const guidance = generatePersonalizedGuidance('school_infant', wazirpur.aqi);
      expect(guidance.title).toBe('Pediatric Defense Protocol Active');
      expect(guidance.hepaSetting).toContain('Continuous');

      // Verify diurnal routine slot includes golden afternoon window
      const goldenWindow = DAILY_ROUTINE_SLOTS.find((s) => s.actionBadge === 'VENTILATION WINDOW');
      expect(goldenWindow).toBeDefined();
      expect(goldenWindow.timeSlot).toBe('13:30 – 15:30');
    });
  });

  describe('Journey 3: Clean Sustainable Alternatives & Transparent Financial ROI', () => {
    it('calculates explainable emissions avoided and financial savings for commuter modal shift', () => {
      const commuteKm = 24; // 24 km daily roundtrip
      const impact = calculateCommunitySavings(
        commuteKm,
        'petrolCar',
        'eRickshawMetro',
        true, // avoidedBiomassHeating
        true // compostedWaste
      );

      // Verify transit savings
      expect(impact.breakdown.co2TransitKg).toBeGreaterThan(4.0);
      expect(impact.breakdown.fuelSavingsInr).toBeGreaterThan(120);

      // Verify total financial ROI is strictly positive and explained
      expect(impact.totalFinancialSavingsInr).toBeGreaterThan(100);
      expect(impact.methodologyNote).toContain('CPCB');

      const healthRisk = calculateHealthRiskIndex(25, false, true);
      expect(healthRisk.riskTier).toBe('Minimal Impact');
    });
  });

  describe('Journey 4: Verifiable Multi-Agent Orchestration & Attestation', () => {
    it('coordinates multi-agent consensus with verifiable cryptographic attestation tokens', async () => {
      const consensus = await orchestrateMultiAgentConsensus({ familyArchetype: 'asthma_seniors' });
      expect(consensus.agentsEngaged).toEqual(['IAQEngineer', 'PediatricShield', 'EcoAuditor']);
      expect(consensus.consensusText).toContain('IAQEngineer');
      expect(consensus.consensusText).toContain('PediatricShield');
      expect(consensus.consensusText).toContain('EcoAuditor');
      expect(consensus.consensusToken.length).toBe(64);

      // Direct single agent execution
      const single = await orchestrateAgentWorkflow(
        'When to ventilate window',
        {},
        'meteo_forecaster'
      );
      expect(single.agentId).toBe('meteo_forecaster');
      expect(single.attestationToken.length).toBe(64);
      expect(single.trace.length).toBeGreaterThanOrEqual(4);
    });
  });
});

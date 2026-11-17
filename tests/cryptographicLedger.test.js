import { describe, it, expect } from 'vitest';
import {
  sha256,
  sha256Async,
  computeBlockHash,
  verifyLedgerIntegrity,
  repairLedgerChain,
  computeMerkleRoot
} from '../src/utils/sanitize';
import { INITIAL_CITIZEN_REPORTS } from '../src/data/airData';

describe('Cryptographic Hash-Chain Ledger & SHA-256 Primitives', () => {
  describe('FIPS 180-4 Standard SHA-256 Vectors', () => {
    it('matches NIST test vector for empty string', () => {
      expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });

    it('matches NIST test vector for "abc"', () => {
      expect(sha256('abc')).toBe(
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
      );
    });

    it('matches NIST test vector for "The quick brown fox jumps over the lazy dog"', () => {
      expect(sha256('The quick brown fox jumps over the lazy dog')).toBe(
        'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592'
      );
    });

    it('produces identical output with async Web Crypto sha256Async', async () => {
      const text = 'AURA-COMMUNITY-LEDGER-VERIFICATION';
      const syncHash = sha256(text);
      const asyncHash = await sha256Async(text);
      expect(asyncHash).toBe(syncHash);
      expect(asyncHash.length).toBe(64);
    });
  });

  describe('Immutable Citizen Reports Ledger Integrity', () => {
    it('verifies 100% cryptographic integrity of INITIAL_CITIZEN_REPORTS', () => {
      const result = verifyLedgerIntegrity(INITIAL_CITIZEN_REPORTS);
      expect(result.valid).toBe(true);
      expect(result.brokenIndex).toBe(-1);
      expect(result.reason).toBe(null);
    });

    it('detects tampering when an adversary modifies an intermediate block issue', () => {
      const tamperedChain = JSON.parse(JSON.stringify(INITIAL_CITIZEN_REPORTS));
      tamperedChain[1].issue = '[MODIFIED] Concealing illegal rubber chimney burning';

      const result = verifyLedgerIntegrity(tamperedChain);
      expect(result.valid).toBe(false);
      expect(result.brokenIndex).toBe(1);
      expect(result.reason).toContain('hash mismatch');
    });

    it('detects tampering when an adversary alters prevHash pointer', () => {
      const tamperedChain = JSON.parse(JSON.stringify(INITIAL_CITIZEN_REPORTS));
      tamperedChain[2].prevHash =
        '000000000000000000000000000000000000000000000000000000000000dead';

      const result = verifyLedgerIntegrity(tamperedChain);
      expect(result.valid).toBe(false);
      expect(result.brokenIndex).toBe(2);
      expect(result.reason).toContain('chain link broken');
    });

    it('successfully computes new block hash and preserves chain integrity upon appending', () => {
      const chain = [...INITIAL_CITIZEN_REPORTS];
      const lastBlock = chain[chain.length - 1];
      const newBlock = {
        id: 'REP-AURA-8105',
        issue: 'New biomass smoldering incident at Okhla Phase 2',
        location: 'Okhla Phase 2',
        reporter: 'Citizen Ritu',
        urgency: 'High',
        prevHash: lastBlock.hash
      };
      newBlock.hash = computeBlockHash(newBlock, lastBlock.hash);
      chain.push(newBlock);

      const verification = verifyLedgerIntegrity(chain);
      expect(verification.valid).toBe(true);
      expect(chain.length).toBe(5);
    });

    it('safely recovers corrupted blocks without deleting user-added reports (zero data loss)', () => {
      // 1. Start with initial 4 blocks and add 2 new user reports
      const chain = [...INITIAL_CITIZEN_REPORTS];
      const canonicalStore = {};
      INITIAL_CITIZEN_REPORTS.forEach((b) => {
        canonicalStore[b.id] = { ...b };
      });

      // User adds Block 5
      const b5 = {
        id: 'REP-AURA-8105',
        issue: 'Illegal rubber incineration behind metro depot',
        location: 'Anand Vihar Sector 3',
        reporter: 'Citizen Amit',
        urgency: 'Critical',
        prevHash: chain[chain.length - 1].hash
      };
      b5.hash = computeBlockHash(b5, b5.prevHash);
      chain.push(b5);
      canonicalStore[b5.id] = { ...b5 };

      // User adds Block 6
      const b6 = {
        id: 'REP-AURA-8106',
        issue: 'Dust storm from uncovered construction sand heaps',
        location: 'Rohini Sector 18',
        reporter: 'Resident Priya',
        urgency: 'Medium',
        prevHash: b5.hash
      };
      b6.hash = computeBlockHash(b6, b6.prevHash);
      chain.push(b6);
      canonicalStore[b6.id] = { ...b6 };

      expect(chain.length).toBe(6);
      expect(verifyLedgerIntegrity(chain).valid).toBe(true);

      // 2. Adversary corrupts Block 2 (index 1) to conceal industrial emissions
      chain[1].issue = '[TAMPERED] Concealing industrial stack emissions';
      chain[1].hash = '000000000000000000000000000000000000000000000000000000000000dead';

      // Verify tamper is detected
      const check = verifyLedgerIntegrity(chain);
      expect(check.valid).toBe(false);
      expect(check.brokenIndex).toBe(1);

      // 3. Execute safe recovery
      const recovery = repairLedgerChain(chain, canonicalStore);
      expect(recovery.success).toBe(true);
      expect(recovery.restoredCount).toBe(1);
      expect(recovery.preservedCount).toBe(6); // All 6 blocks preserved!
      expect(recovery.quarantinedEvidence.length).toBe(1);
      expect(recovery.quarantinedEvidence[0].blockId).toBe('REP-AURA-8102');

      // 4. Verify repaired chain integrity and data preservation
      const repairedChain = recovery.repairedChain;
      expect(verifyLedgerIntegrity(repairedChain).valid).toBe(true);
      expect(repairedChain[1].issue).toBe(
        'Dense Chemical Fumes & Black Smoke from Fabrication Chimney'
      );
      expect(repairedChain[1].isAuthenticRestored).toBe(true);
      expect(repairedChain[1].recoveryProvenance).toBe('VERIFIED_CANONICAL_BASELINE');

      // Blocks 5 and 6 are intact with original content!
      expect(repairedChain[4].id).toBe('REP-AURA-8105');
      expect(repairedChain[4].issue).toBe('Illegal rubber incineration behind metro depot');
      expect(repairedChain[5].id).toBe('REP-AURA-8106');
      expect(repairedChain[5].reporter).toBe('Resident Priya');
    });

    it('explicitly labels unverified recovered blocks without canonical baseline as isolated evidence', () => {
      const chain = INITIAL_CITIZEN_REPORTS.map((r) => ({ ...r }));
      // Corrupt block 2 and omit from canonicalStore
      chain[1].issue = '[TAMPERED] Fabricated report without canonical snapshot';
      chain[1].hash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';

      const emptyStore = {}; // No canonical baseline
      const recovery = repairLedgerChain(chain, emptyStore);

      expect(recovery.success).toBe(true);
      const repairedBlock = recovery.repairedChain[1];
      expect(repairedBlock.isAuthenticRestored).toBe(false);
      expect(repairedBlock.recoveryProvenance).toBe('UNVERIFIED_EVIDENCE_ISOLATED');
      expect(repairedBlock.issue).toContain('[UNVERIFIED RECOVERED EVIDENCE]');
    });
  });

  describe('Merkle Tree Root Computation', () => {
    it('computes 64-character SHA-256 Merkle root from block hashes', () => {
      const hashes = INITIAL_CITIZEN_REPORTS.map((r) => r.hash);
      const root = computeMerkleRoot(hashes);
      expect(root.length).toBe(64);
      expect(/^[0-9a-f]{64}$/.test(root)).toBe(true);
    });

    it('dynamically changes root if any single leaf hash is altered', () => {
      const hashes1 = INITIAL_CITIZEN_REPORTS.map((r) => r.hash);
      const hashes2 = [...hashes1];
      hashes2[0] = '1111111111111111111111111111111111111111111111111111111111111111';

      const root1 = computeMerkleRoot(hashes1);
      const root2 = computeMerkleRoot(hashes2);
      expect(root1).not.toBe(root2);
    });

    it('returns 64 zeros for empty hash array', () => {
      expect(computeMerkleRoot([])).toBe('0'.repeat(64));
    });
  });
});

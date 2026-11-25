import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  sha256,
  sha256Async,
  computeBlockHash,
  verifyLedgerIntegrity,
  computeMerkleRoot,
  repairLedgerChain
} from '../src/utils/crypto';

const GENESIS = '0'.repeat(64);
const KNOWN_EMPTY_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const KNOWN_ABC_HASH = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

const makeBlock = (id, prevHash, overrides = {}) => {
  const block = {
    id,
    issue: `Issue ${id}`,
    location: 'Test Ward',
    reporter: 'Test Reporter',
    urgency: 'High',
    prevHash,
    ...overrides
  };
  block.hash = computeBlockHash(block, prevHash);
  return block;
};

const makeChain = () => {
  const first = makeBlock('B1', GENESIS);
  const second = makeBlock('B2', first.hash);
  const third = makeBlock('B3', second.hash);
  return [first, second, third];
};

describe('crypto branch coverage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('sha256', () => {
    it('matches known FIPS 180-4 vectors', () => {
      expect(sha256('')).toBe(KNOWN_EMPTY_HASH);
      expect(sha256('abc')).toBe(KNOWN_ABC_HASH);
    });

    it('stringifies non-string input', () => {
      expect(sha256(123)).toBe(sha256('123'));
      expect(sha256(null)).toBe(KNOWN_EMPTY_HASH);
    });
  });

  describe('sha256Async', () => {
    it('uses Web Crypto subtle when available', async () => {
      const digest = await sha256Async('abc');
      expect(digest).toBe(KNOWN_ABC_HASH);
    });

    it('falls back to the sync implementation when subtle throws', async () => {
      vi.stubGlobal('crypto', {
        subtle: { digest: vi.fn().mockRejectedValue(new Error('subtle unavailable')) }
      });
      const digest = await sha256Async('abc');
      expect(digest).toBe(KNOWN_ABC_HASH);
    });

    it('falls back to the sync implementation when subtle is missing', async () => {
      vi.stubGlobal('crypto', {});
      const digest = await sha256Async('abc');
      expect(digest).toBe(KNOWN_ABC_HASH);
    });

    it('hashes null and undefined as the empty string', async () => {
      expect(await sha256Async(null)).toBe(KNOWN_EMPTY_HASH);
      expect(await sha256Async(undefined)).toBe(KNOWN_EMPTY_HASH);
    });
  });

  describe('computeBlockHash', () => {
    it('uses the genesis zero hash when prevHash is missing', () => {
      const block = {
        id: 'B1',
        issue: 'Issue',
        location: 'Loc',
        reporter: 'Rep',
        urgency: 'High'
      };
      const hash = computeBlockHash(block);
      expect(hash).toBe(sha256(`${GENESIS}|B1|Issue|Loc|Rep|High`));
    });

    it('uses an explicit prevHash override', () => {
      const block = {
        id: 'B1',
        issue: 'Issue',
        location: 'Loc',
        reporter: 'Rep',
        urgency: 'High',
        prevHash: GENESIS
      };
      const override = 'a'.repeat(64);
      expect(computeBlockHash(block, override)).toBe(sha256(`${override}|B1|Issue|Loc|Rep|High`));
    });
  });

  describe('verifyLedgerIntegrity', () => {
    it('treats an empty or non-array chain as valid', () => {
      expect(verifyLedgerIntegrity([])).toEqual({ valid: true, brokenIndex: -1, reason: null });
      expect(verifyLedgerIntegrity(null)).toEqual({
        valid: true,
        brokenIndex: -1,
        reason: null
      });
    });

    it('verifies a correctly chained ledger', () => {
      const result = verifyLedgerIntegrity(makeChain());
      expect(result).toEqual({ valid: true, brokenIndex: -1, reason: null });
    });

    it('detects a broken pointer link in the middle block', () => {
      const chain = makeChain();
      chain[1].prevHash = 'f'.repeat(64);
      const result = verifyLedgerIntegrity(chain);
      expect(result.valid).toBe(false);
      expect(result.brokenIndex).toBe(1);
      expect(result.reason).toContain('chain link broken');
    });

    it('detects a broken genesis pointer', () => {
      const chain = makeChain();
      chain[0].prevHash = 'a'.repeat(64);
      const result = verifyLedgerIntegrity(chain);
      expect(result.valid).toBe(false);
      expect(result.brokenIndex).toBe(0);
      expect(result.reason).toContain('chain link broken');
    });

    it('detects a hash mismatch when the payload changed', () => {
      const chain = makeChain();
      chain[1].issue = 'Tampered issue text';
      const result = verifyLedgerIntegrity(chain);
      expect(result.valid).toBe(false);
      expect(result.brokenIndex).toBe(1);
      expect(result.reason).toContain('hash mismatch');
    });

    it('reports null for a missing prevHash in the broken-link reason', () => {
      const chain = makeChain();
      chain[1].prevHash = null;
      const result = verifyLedgerIntegrity(chain);
      expect(result.valid).toBe(false);
      expect(result.brokenIndex).toBe(1);
      expect(result.reason).toContain('chain link broken');
      expect(result.reason).toContain('null');
    });

    it('reports null for a missing hash in the mismatch reason', () => {
      const chain = makeChain();
      chain[1].hash = null;
      const result = verifyLedgerIntegrity(chain);
      expect(result.valid).toBe(false);
      expect(result.brokenIndex).toBe(1);
      expect(result.reason).toContain('hash mismatch');
      expect(result.reason).toContain('null');
    });
  });

  describe('computeMerkleRoot', () => {
    it('returns the zero hash for an empty input', () => {
      expect(computeMerkleRoot([])).toBe(GENESIS);
      expect(computeMerkleRoot(null)).toBe(GENESIS);
    });

    it('returns the single hash unchanged', () => {
      const h = sha256('leaf');
      expect(computeMerkleRoot([h])).toBe(h);
    });

    it('hashes two leaves together', () => {
      const h1 = sha256('leaf-one');
      const h2 = sha256('leaf-two');
      expect(computeMerkleRoot([h1, h2])).toBe(sha256(h1 + h2));
    });

    it('duplicates the last leaf on an odd level', () => {
      const h1 = sha256('leaf-one');
      const h2 = sha256('leaf-two');
      const h3 = sha256('leaf-three');
      expect(computeMerkleRoot([h1, h2, h3])).toBe(sha256(sha256(h1 + h2) + sha256(h3 + h3)));
    });

    it('hashes short non-64-char inputs before building the tree', () => {
      expect(computeMerkleRoot(['abc'])).toBe(sha256('abc'));
    });
  });

  describe('repairLedgerChain', () => {
    it('returns an empty success result for an empty chain', () => {
      const result = repairLedgerChain([], null);
      expect(result).toEqual({
        success: true,
        repairedChain: [],
        restoredCount: 0,
        preservedCount: 0,
        quarantinedEvidence: []
      });
    });

    it('leaves a valid chain untouched', () => {
      const chain = makeChain();
      const result = repairLedgerChain(chain, null);
      expect(result.success).toBe(true);
      expect(result.restoredCount).toBe(0);
      expect(result.quarantinedEvidence).toHaveLength(0);
      expect(result.preservedCount).toBe(3);
      expect(verifyLedgerIntegrity(result.repairedChain).valid).toBe(true);
    });

    it('restores a tampered block from a canonical Map store', () => {
      const chain = makeChain();
      chain[1].issue = '[TAMPERED BY POLLUTER] Fake issue';
      chain[1].hash = 'd'.repeat(64);

      const canonical = new Map([
        [
          'B2',
          { issue: 'Issue B2', location: 'Test Ward', reporter: 'Test Reporter', urgency: 'High' }
        ]
      ]);
      const result = repairLedgerChain(chain, canonical);

      expect(result.success).toBe(true);
      expect(result.restoredCount).toBe(1);
      expect(result.quarantinedEvidence).toHaveLength(1);
      expect(result.quarantinedEvidence[0].blockId).toBe('B2');
      expect(result.repairedChain[1].issue).toBe('Issue B2');
      expect(result.repairedChain[1].isAuthenticRestored).toBe(true);
      expect(result.repairedChain[1].recoveryProvenance).toBe('VERIFIED_CANONICAL_BASELINE');
      expect(verifyLedgerIntegrity(result.repairedChain).valid).toBe(true);
    });

    it('restores a tampered block from a canonical plain-object store', () => {
      const chain = makeChain();
      chain[2].issue = 'Changed payload';
      const canonical = {
        B3: { issue: 'Issue B3', location: 'Test Ward', reporter: 'Test Reporter', urgency: 'High' }
      };
      const result = repairLedgerChain(chain, canonical);
      expect(result.success).toBe(true);
      expect(result.restoredCount).toBe(1);
      expect(result.repairedChain[2].issue).toBe('Issue B3');
    });

    it('quarantines a tampered block with no canonical baseline', () => {
      const chain = makeChain();
      chain[1].issue = '[TAMPERED BY POLLUTER] Fake issue text';
      chain[1].hash = 'd'.repeat(64);

      const result = repairLedgerChain(chain, null);
      expect(result.success).toBe(true);
      expect(result.restoredCount).toBe(0);
      expect(result.repairedChain[1].issue).toBe('[UNVERIFIED RECOVERED EVIDENCE] Fake issue text');
      expect(result.repairedChain[1].isAuthenticRestored).toBe(false);
      expect(result.repairedChain[1].recoveryProvenance).toBe('UNVERIFIED_EVIDENCE_ISOLATED');
      expect(verifyLedgerIntegrity(result.repairedChain).valid).toBe(true);
    });

    it('repairs pointer-only corruption where the hash was recomputed', () => {
      const chain = makeChain();
      const wrongPrev = 'f'.repeat(64);
      chain[1].prevHash = wrongPrev;
      chain[1].hash = computeBlockHash(chain[1], wrongPrev);

      const canonical = new Map([
        [
          'B2',
          { issue: 'Issue B2', location: 'Test Ward', reporter: 'Test Reporter', urgency: 'High' }
        ]
      ]);
      const result = repairLedgerChain(chain, canonical);
      expect(result.success).toBe(true);
      expect(result.restoredCount).toBe(1);
      expect(result.repairedChain[1].prevHash).toBe(chain[0].hash);
      expect(verifyLedgerIntegrity(result.repairedChain).valid).toBe(true);
    });
  });
});

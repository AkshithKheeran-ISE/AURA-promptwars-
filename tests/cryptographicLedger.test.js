import { describe, it, expect } from 'vitest';
import { generateDeterministicHash } from '../src/utils/sanitize';

function validateChain(chain) {
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const prev = chain[i - 1];
    if (current.prevHash !== prev.hash) {
      return { valid: false, brokenIndex: i };
    }
  }
  return { valid: true, brokenIndex: -1 };
}

describe('Cryptographic Hash-Chain Ledger', () => {
  it('verifies integrity of un-tampered sequential blocks', () => {
    const b0 = { id: 0, text: 'Genesis Block', prevHash: '0000000000000000', hash: generateDeterministicHash('genesis') };
    const b1 = { id: 1, text: 'Report 1: Biomass burning', prevHash: b0.hash, hash: generateDeterministicHash(`${b0.hash}-b1`) };
    const b2 = { id: 2, text: 'Report 2: Generator noise', prevHash: b1.hash, hash: generateDeterministicHash(`${b1.hash}-b2`) };

    const chain = [b0, b1, b2];
    const result = validateChain(chain);
    expect(result.valid).toBe(true);
    expect(result.brokenIndex).toBe(-1);
  });

  it('detects tampering when an adversary modifies an intermediate block', () => {
    const b0 = { id: 0, text: 'Genesis Block', prevHash: '0000000000000000', hash: generateDeterministicHash('genesis') };
    const b1 = { id: 1, text: 'Report 1: Biomass burning', prevHash: b0.hash, hash: generateDeterministicHash(`${b0.hash}-b1`) };
    const b2 = { id: 2, text: 'Report 2: Generator noise', prevHash: b1.hash, hash: generateDeterministicHash(`${b1.hash}-b2`) };

    const chain = [b0, b1, b2];

    // Adversary tampers with block 1
    chain[1].hash = 'TAMPERED_HASH_9999999999999999999999999';

    const result = validateChain(chain);
    expect(result.valid).toBe(false);
    expect(result.brokenIndex).toBe(2); // Block 2 prevHash doesn't match block 1's tampered hash
  });
});

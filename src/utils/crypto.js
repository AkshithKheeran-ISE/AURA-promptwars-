/**
 * Cryptographic Utilities & SHA-256 Hash-Chain Engine.
 * Implements SHA-256 using TextEncoder and DataView word packing.
 */

function rightRotate(value, amount) {
  return (value >>> amount) | (value << (32 - amount));
}

function buildSha256Constants() {
  const maxWord = Math.pow(2, 32);
  const hash = [];
  const k = [];
  let primeCounter = 0;
  const isComposite = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = Math.trunc(Math.pow(candidate, 0.5) * maxWord);
      k[primeCounter++] = Math.trunc(Math.pow(candidate, 1 / 3) * maxWord);
    }
  }
  return { initialHash: hash.slice(0, 8), k };
}

const { initialHash: SHA256_INIT_HASH, k: SHA256_K } = buildSha256Constants();

function padSha256Bytes(bytes) {
  const byteLength = bytes.length;
  const bitLength = byteLength * 8;
  const padLength = (56 - ((byteLength + 1) % 64) + 64) % 64;
  const totalBytes = byteLength + 1 + padLength + 8;

  const padded = new Uint8Array(totalBytes);
  padded.set(bytes);
  padded[byteLength] = 0x80;

  const view = new DataView(padded.buffer);
  const maxWord = Math.pow(2, 32);
  const hi = Math.floor(bitLength / maxWord);
  const lo = bitLength >>> 0;
  view.setUint32(totalBytes - 8, hi, false);
  view.setUint32(totalBytes - 4, lo, false);

  const wordCount = totalBytes >> 2;
  const words = new Array(wordCount);
  for (let i = 0; i < wordCount; i++) {
    words[i] = view.getUint32(i * 4, false);
  }
  return words;
}

function computeSha256Round(w, i, hash) {
  const w15 = w[i - 15];
  const w2 = w[i - 2];
  const a = hash[0];
  const e = hash[4];
  const scheduleWord =
    i < 16
      ? w[i]
      : Math.trunc(
          w[i - 16] +
            (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
            w[i - 7] +
            (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
        ) & -1;
  w[i] = scheduleWord;

  const temp1 =
    hash[7] +
    (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
    ((e & hash[5]) ^ (~e & hash[6])) +
    SHA256_K[i] +
    scheduleWord;
  const temp2 =
    (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
    ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

  hash.unshift(Math.trunc(temp1 + temp2) & -1);
  hash.length = 8;
  hash[4] = Math.trunc(hash[4] + temp1) & -1;
}

function processSha256Chunk(w, hash) {
  const oldHash = hash.slice(0, 8);
  for (let i = 0; i < 64; i++) {
    computeSha256Round(w, i, hash);
  }
  for (let i = 0; i < 8; i++) {
    hash[i] = Math.trunc(hash[i] + oldHash[i]) & -1;
  }
}

function formatSha256Digest(hash) {
  let result = '';
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Standard FIPS 180-4 SHA-256 cryptographic hash function using TextEncoder.
 * Outputs genuine 64-character lowercase hexadecimal digest.
 * @param {string|number|object} input - Input to hash
 * @returns {string} 64-character SHA-256 hexadecimal string
 */
export function sha256(input) {
  const raw = typeof input !== 'string' ? String(input ?? '') : input;
  const bytes = new TextEncoder().encode(raw);
  const words = padSha256Bytes(bytes);
  const hash = SHA256_INIT_HASH.slice();

  for (let j = 0; j < words.length;) {
    const chunk = words.slice(j, (j += 16));
    processSha256Chunk(chunk, hash);
  }

  return formatSha256Digest(hash);
}

/**
 * Asynchronous Web Crypto SHA-256 implementation using native browser crypto.subtle.
 * Falls back to synchronous FIPS 180-4 sha256 when subtle is unavailable.
 * @param {string} message - String to hash
 * @returns {Promise<string>} 64-character hex digest
 */
export async function sha256Async(message) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(String(message ?? ''));
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return sha256(message);
    }
  }
  return sha256(message);
}

export const generateDeterministicHash = sha256;

/**
 * Computes a genuine SHA-256 block hash for an immutable citizen report ledger entry.
 * @param {any} block - { id, issue, location, reporter, urgency, prevHash }
 * @param {string} [prevHash] - Optional override for previous block hash
 * @returns {string} 64-character SHA-256 hash
 */
export function computeBlockHash(block, prevHash = block.prevHash) {
  const safePrev = prevHash || '0'.repeat(64);
  const payload = `${safePrev}|${block.id}|${block.issue}|${block.location}|${block.reporter}|${block.urgency}`;
  return sha256(payload);
}

/**
 * Cryptographically verifies every block in a citizen reporting ledger chain.
 * Recalculates each block's SHA-256 hash and verifies pointer consistency.
 * @param {Array<any>} chain - Array of chained report blocks
 * @returns {{ valid: boolean, brokenIndex: number, reason: string | null }}
 */
export function verifyLedgerIntegrity(chain) {
  if (!Array.isArray(chain) || chain.length === 0) {
    return { valid: true, brokenIndex: -1, reason: null };
  }

  const GENESIS_PREV_HASH = '0'.repeat(64);

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const expectedPrev = i === 0 ? GENESIS_PREV_HASH : chain[i - 1].hash;

    if (block.prevHash !== expectedPrev) {
      return {
        valid: false,
        brokenIndex: i,
        reason: `Block #${i + 1} (${block.id}) chain link broken. Expected prevHash ${expectedPrev.slice(0, 16)}..., found ${block.prevHash ? block.prevHash.slice(0, 16) : 'null'}...`
      };
    }

    const computed = computeBlockHash(block, block.prevHash);
    if (block.hash !== computed) {
      return {
        valid: false,
        brokenIndex: i,
        reason: `Block #${i + 1} (${block.id}) hash mismatch. Stored: ${block.hash ? block.hash.slice(0, 16) : 'null'}..., Computed: ${computed.slice(0, 16)}...`
      };
    }
  }

  return { valid: true, brokenIndex: -1, reason: null };
}

/**
 * Computes a binary Merkle tree root from an array of block hashes.
 * @param {string[]} hashes - Array of hexadecimal hash strings
 * @returns {string} 64-character SHA-256 Merkle root
 */
export function computeMerkleRoot(hashes) {
  if (!Array.isArray(hashes) || hashes.length === 0) {
    return '0'.repeat(64);
  }

  let currentLevel = hashes.map((h) => (h && h.length === 64 ? h : sha256(String(h))));

  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      nextLevel.push(sha256(left + right));
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0];
}

/**
 * Recovers a corrupted ledger chain while preserving valid user reports.
 * @param {Array<any>} chain - The active ledger chain with a corrupted block
 * @param {any} canonicalStore - Authentic baseline payloads
 * @returns {{
 *   success: boolean,
 *   repairedChain: Array<any>,
 *   restoredCount: number,
 *   preservedCount: number,
 *   quarantinedEvidence: Array<any>
 * }}
 */
export function repairLedgerChain(chain, canonicalStore) {
  if (!Array.isArray(chain) || chain.length === 0) {
    return {
      success: true,
      repairedChain: [],
      restoredCount: 0,
      preservedCount: 0,
      quarantinedEvidence: []
    };
  }

  const repaired = chain.map((block) => ({ ...block }));
  /** @type {Array<any>} */
  const quarantinedEvidence = [];
  let restoredCount = 0;
  const GENESIS_PREV_HASH = '0'.repeat(64);

  const getCanonical = (id) => {
    if (canonicalStore instanceof Map) return canonicalStore.get(id);
    if (canonicalStore && typeof canonicalStore === 'object') return canonicalStore[id];
    return null;
  };

  for (let i = 0; i < repaired.length; i++) {
    const block = repaired[i];
    const expectedPrev = i === 0 ? GENESIS_PREV_HASH : repaired[i - 1].hash;
    const computed = computeBlockHash(block, expectedPrev);

    const hasPointerCorruption = block.prevHash !== expectedPrev;
    const hasHashCorruption = block.hash !== computed;

    if (hasPointerCorruption || hasHashCorruption) {
      quarantinedEvidence.push({
        blockIndex: i,
        blockId: block.id,
        tamperedPayload: { ...block },
        expectedPrev,
        detectedAt: Date.now()
      });

      const canonicalRecord = getCanonical(block.id);
      if (canonicalRecord) {
        block.issue = canonicalRecord.issue;
        block.location = canonicalRecord.location;
        block.reporter = canonicalRecord.reporter;
        block.urgency = canonicalRecord.urgency;
        block.isAuthenticRestored = true;
        block.recoveryProvenance = 'VERIFIED_CANONICAL_BASELINE';
        restoredCount++;
      } else {
        block.issue = `[UNVERIFIED RECOVERED EVIDENCE] ${block.issue.replace(/\[TAMPERED[^\]]*\]\s*/gi, '')}`;
        block.isAuthenticRestored = false;
        block.recoveryProvenance = 'UNVERIFIED_EVIDENCE_ISOLATED';
      }

      block.prevHash = expectedPrev;
      block.hash = computeBlockHash(block, expectedPrev);
    } else {
      if (block.prevHash !== expectedPrev) {
        block.prevHash = expectedPrev;
        block.hash = computeBlockHash(block, expectedPrev);
      }
    }
  }

  const verification = verifyLedgerIntegrity(repaired);
  return {
    success: verification.valid,
    repairedChain: repaired,
    restoredCount,
    preservedCount: repaired.length,
    quarantinedEvidence
  };
}

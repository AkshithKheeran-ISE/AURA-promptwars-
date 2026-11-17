/**
 * @file sanitize.js
 * Security utility for input sanitization, XSS neutralization,
 * HTML escaping, cryptographic SHA-256 hashing, Merkle tree computation,
 * and immutable ledger integrity verification.
 */

const HTML_ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;'
};

/**
 * Escapes dangerous HTML characters to prevent XSS injection attacks.
 * @param {string} str - Raw user input
 * @returns {string} Sanitized string
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`/]/g, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Strips all HTML tags and script elements completely.
 * @param {string} str - Input with potential HTML
 * @returns {string} Plain text with tags removed
 */
export function stripHtmlTags(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Sanitizes user input for forms and terminal commands:
 * 1. Strips HTML tags
 * 2. Neutralizes javascript: or data: URI schemes
 * 3. Removes event handlers like onclick, onerror
 * 4. Truncates to max allowable length
 * @param {string} input - Raw user input
 * @param {number} maxLength - Maximum allowable length (default: 500)
 * @returns {string} Clean, safe text
 */
export function sanitizeInput(input, maxLength = 500) {
  if (!input || typeof input !== 'string') return '';

  let clean = stripHtmlTags(input)
    .replace(/(?:javascript|vbscript|data):/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }

  return clean;
}

/**
 * Validates a citizen smog report before chaining to the ledger.
 * @param {object} report - { location, issue, reporter, urgency }
 * @returns {object} { isValid: boolean, errors: string[], sanitized: object }
 */
export function validateCitizenReport(report) {
  const errors = [];

  if (!report || typeof report !== 'object') {
    return { isValid: false, errors: ['Invalid report payload'], sanitized: null };
  }

  const location = sanitizeInput(report.location || '', 100);
  const issue = sanitizeInput(report.issue || '', 300);
  const reporter = sanitizeInput(report.reporter || '', 80);
  const urgency = ['Critical', 'High', 'Medium', 'Low'].includes(report.urgency)
    ? report.urgency
    : 'Medium';

  if (!location || location.length < 3) {
    errors.push('Location must be at least 3 characters.');
  }

  if (!issue || issue.length < 5) {
    errors.push('Issue description must be at least 5 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      location,
      issue,
      reporter: reporter || 'Anonymous Resident',
      urgency
    }
  };
}

/**
 * Standard FIPS 180-4 SHA-256 cryptographic hash function.
 * Outputs genuine 64-character lowercase hexadecimal digest.
 * @param {string} input - Raw string or object to hash
 * @returns {string} 64-character SHA-256 hexadecimal string
 */
export function sha256(input) {
  const raw = typeof input !== 'string' ? String(input ?? '') : input;
  // Convert Unicode string to UTF-8 byte stream
  const ascii = unescape(encodeURIComponent(raw));

  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const words = [];
  const asciiBitLength = ascii.length * 8;
  const hash = [];
  const k = [];
  let primeCounter = 0;
  const isComposite = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  let padded = ascii + '\x80';
  while ((padded.length % 64) - 56) padded += '\x00';
  for (let i = 0; i < padded.length; i++) {
    const j = padded.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (let j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0, 8);

    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = hash[0];
      const e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash.unshift((temp1 + temp2) | 0);
      hash.length = 8;
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

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
      // Fallback
    }
  }
  return sha256(message);
}

/**
 * Backward-compatible alias for sha256.
 * Guarantees standard 64-character SHA-256 hex output across the application.
 */
export const generateDeterministicHash = sha256;

/**
 * Computes a genuine SHA-256 block hash for an immutable citizen report ledger entry.
 * @param {object} block - { id, issue, location, reporter, urgency, prevHash }
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
 * @param {Array<object>} chain - Array of chained report blocks
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
 * Safely recovers a corrupted ledger chain while preserving 100% of valid user reports.
 * 1. Isolates corrupted blocks without deleting user submissions.
 * 2. Restores authentic payload for corrupted blocks from canonical storage.
 * 3. Re-chains hashes forward to the tip so all valid user records are retained.
 * 4. Captures cryptographic forensic evidence of the tamper attempt.
 *
 * @param {Array<object>} chain - The active ledger chain with a corrupted block
 * @param {Map<string, object>|Record<string, object>} canonicalStore - Authentic baseline payloads
 * @returns {{
 *   success: boolean,
 *   repairedChain: Array<object>,
 *   restoredCount: number,
 *   preservedCount: number,
 *   quarantinedEvidence: Array<object>
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
        restoredCount++;
      } else {
        block.issue = `[RECOVERED EVIDENCE] ${block.issue.replace(/\[TAMPERED[^\]]*\]\s*/gi, '')}`;
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


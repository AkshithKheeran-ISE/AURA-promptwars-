/**
 * @file sanitize.js
 * Security utility for input sanitization, XSS neutralization,
 * HTML escaping, and input validation.
 * Cryptographic hashing and ledger integrity primitives are housed in ./crypto.js.
 */

export {
  sha256,
  sha256Async,
  generateDeterministicHash,
  computeBlockHash,
  verifyLedgerIntegrity,
  computeMerkleRoot,
  repairLedgerChain
} from './crypto';

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
 * Removes blocks delimited by openTag and closeTag in linear time using indexOf.
 * If closeTag or the closing delimiter is not found, truncates to the end.
 * @param {string} str - Input string
 * @param {string} openTag - e.g. '<script'
 * @param {string} closeTag - e.g. '</script'
 * @returns {string} Cleaned string
 */
function removeBlock(str, openTag, closeTag) {
  const lower = str.toLowerCase();
  const chunks = [];
  let startIdx = 0;

  while (startIdx < str.length) {
    const openIdx = lower.indexOf(openTag, startIdx);
    if (openIdx === -1) {
      chunks.push(str.slice(startIdx));
      break;
    }
    chunks.push(str.slice(startIdx, openIdx));
    const closeIdx = lower.indexOf(closeTag, openIdx + openTag.length);
    if (closeIdx === -1) {
      break;
    }
    const endOfClose = lower.indexOf('>', closeIdx + closeTag.length);
    if (endOfClose === -1) {
      break;
    }
    startIdx = endOfClose + 1;
  }
  return chunks.join('');
}

/**
 * Strips all HTML tags and script/style elements completely via linear string scan.
 * @param {string} str - Input with potential HTML
 * @returns {string} Plain text with tags removed
 */
export function stripHtmlTags(str) {
  if (typeof str !== 'string') return '';
  const input = str.length > 50000 ? str.slice(0, 50000) : str;
  let text = removeBlock(input, '<script', '</script');
  text = removeBlock(text, '<style', '</style');

  const chars = [];
  let inTag = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '<') {
      inTag = true;
    } else if (ch === '>') {
      inTag = false;
    } else if (!inTag) {
      chars.push(ch);
    }
  }
  return chars.join('').trim();
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
 * @param {any} report - { location, issue, reporter, urgency }
 * @returns {{ isValid: boolean, errors: string[], sanitized: any }}
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

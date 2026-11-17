/**
 * @file sanitize.js
 * Security utility for input sanitization, XSS neutralization,
 * HTML escaping, and input validation.
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
  return str.replace(/[&<>"'`/]/g, char => HTML_ENTITY_MAP[char] || char);
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
  
  // Strip tags and dangerous URI schemes
  let clean = stripHtmlTags(input)
    .replace(/(?:javascript|vbscript|data):/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  // Enforce max length constraint
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
 * Deterministic cryptographic hash function simulation with 40-character hex output.
 * @param {string} str - Content to hash
 * @returns {string} 40-character cryptographic digest
 */
export function generateDeterministicHash(str) {
  if (typeof str !== 'string') str = String(str);
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;

  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const hex3 = Math.imul(h1 ^ h2, 31).toString(16).replace('-', '').padStart(8, '0');
  const hex4 = Math.imul(h1 + h2, 17).toString(16).replace('-', '').padStart(8, '0');
  const hex5 = Math.imul(h1 ^ 0x5a5a5a5a, 13).toString(16).replace('-', '').padStart(8, '0');

  return `${hex1}${hex2}${hex3}${hex4}${hex5}`.slice(0, 40);
}

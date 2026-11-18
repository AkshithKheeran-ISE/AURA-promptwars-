import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  stripHtmlTags,
  sanitizeInput,
  validateCitizenReport,
  generateDeterministicHash
} from '../src/utils/sanitize';

describe('Security & Sanitization Utilities', () => {
  describe('escapeHtml', () => {
    it('escapes standard XSS vectors and special characters', () => {
      const malicious = '<script>alert("xss")</script>';
      const escaped = escapeHtml(malicious);
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('escapes quotes, backticks, and ampersands', () => {
      expect(escapeHtml('`test` & "value" & \'single\'')).toBe(
        '&#x60;test&#x60; &amp; &quot;value&quot; &amp; &#x27;single&#x27;'
      );
    });

    it('handles non-string inputs gracefully', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml(12345)).toBe('');
    });
  });

  describe('stripHtmlTags', () => {
    it('strips HTML tags and embedded scripts completely', () => {
      const dirty = '<b>Hazard Alert:</b> <script>stealCookies()</script>Smog in Wazirpur';
      const clean = stripHtmlTags(dirty);
      expect(clean).toBe('Hazard Alert: Smog in Wazirpur');
    });

    it('strips inline style blocks', () => {
      const dirty = '<style>body { display: none; }</style>Air quality normal';
      expect(stripHtmlTags(dirty)).toBe('Air quality normal');
    });

    it('handles empty or non-string inputs', () => {
      expect(stripHtmlTags('')).toBe('');
      expect(stripHtmlTags(null)).toBe('');
    });

    it('processes very long inputs (50,000+ characters) in under 50 ms without ReDoS', () => {
      const maliciousPayload = '<script ' + 'a="x" '.repeat(10000) + 'console.log(1);';
      const start = performance.now();
      const output = stripHtmlTags(maliciousPayload);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50);
      expect(output).toBeDefined();
    });
  });

  describe('sanitizeInput', () => {
    it('strips dangerous URI schemes (javascript:, vbscript:, data:)', () => {
      const dirty = 'javascript:alert(1) test input';
      expect(sanitizeInput(dirty)).toBe('alert(1) test input');
    });

    it('removes inline event handlers like onerror or onclick', () => {
      const dirty = 'button onclick="evilCode()" test';
      expect(sanitizeInput(dirty)).toBe('button "evilCode()" test');
    });

    it('truncates input exceeding maxLength', () => {
      const longInput = 'A'.repeat(600);
      const sanitized = sanitizeInput(longInput, 100);
      expect(sanitized.length).toBe(100);
    });
  });

  describe('validateCitizenReport', () => {
    it('accepts valid citizen report payload and normalizes fields', () => {
      const payload = {
        location: 'Anand Vihar ISBT',
        issue: 'Heavy diesel bus idling emitting dense plumes',
        reporter: 'Citizen Watch',
        urgency: 'Critical'
      };
      const result = validateCitizenReport(payload);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.sanitized.location).toBe('Anand Vihar ISBT');
      expect(result.sanitized.urgency).toBe('Critical');
    });

    it('rejects payload with invalid location length', () => {
      const payload = {
        location: 'A',
        issue: 'Valid issue description here',
        reporter: 'Tester',
        urgency: 'Medium'
      };
      const result = validateCitizenReport(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Location must be at least 3 characters.');
    });

    it('rejects payload with missing or short issue', () => {
      const payload = {
        location: 'Rohini Sector 14',
        issue: 'Bad',
        reporter: 'Tester',
        urgency: 'Low'
      };
      const result = validateCitizenReport(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Issue description must be at least 5 characters.');
    });

    it('defaults invalid urgency levels to Medium', () => {
      const payload = {
        location: 'Okhla Phase 3',
        issue: 'Factory chimney smoke without scrubbers',
        reporter: 'Resident',
        urgency: 'UNKNOWN_URGENCY'
      };
      const result = validateCitizenReport(payload);
      expect(result.isValid).toBe(true);
      expect(result.sanitized.urgency).toBe('Medium');
    });
  });

  describe('generateDeterministicHash & sha256', () => {
    it('generates consistent standard 64-character SHA-256 hex hash for the same input', () => {
      const input = 'AURA-RECORD-2026-WZP';
      const hash1 = generateDeterministicHash(input);
      const hash2 = generateDeterministicHash(input);
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64);
      expect(/^[0-9a-f]{64}$/i.test(hash1)).toBe(true);
    });

    it('generates distinctly different hashes for modified inputs (avalanche effect)', () => {
      const hashA = generateDeterministicHash('block-1-clean');
      const hashB = generateDeterministicHash('block-1-tampered');
      expect(hashA).not.toBe(hashB);
      expect(hashA.length).toBe(64);
      expect(hashB.length).toBe(64);
    });
  });
});

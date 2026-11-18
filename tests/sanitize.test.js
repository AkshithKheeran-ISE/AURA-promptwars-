import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  stripHtmlTags,
  sanitizeInput,
  validateCitizenReport,
  generateDeterministicHash
} from '../src/utils/sanitize';
import { sanitizePromptText } from '../netlify/functions/gemini';

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

    it('correctly cleans typical HTML structures and preserves text', () => {
      expect(
        stripHtmlTags(
          '<div class="info"><p>PM2.5: <strong>180 µg/m³</strong></p><a href="#">Details</a></div>'
        )
      ).toBe('PM2.5: 180 µg/m³Details');
      expect(stripHtmlTags('<br/><hr/><img src="x" />Clean Text')).toBe('Clean Text');
      expect(stripHtmlTags('Normal prompt without any tags.')).toBe(
        'Normal prompt without any tags.'
      );
    });

    it('handles normal script and style tags', () => {
      const input =
        'Pre <script>console.log("bad")</script> Mid <style>.css{color:red}</style> Post';
      expect(stripHtmlTags(input)).toBe('Pre  Mid  Post');
    });

    it('handles an unclosed <script tag by dropping to the end', () => {
      const input = 'Valid report <script evilUnclosedPayload()';
      expect(stripHtmlTags(input)).toBe('Valid report');
    });

    const verifyLinearExecution = (input, fn, validator) => {
      const start = performance.now();
      const result = fn(input);
      expect(performance.now() - start).toBeLessThan(1000);
      validator(result);
    };

    it.each([
      ['repeated open angle brackets', '<'.repeat(50000), ''],
      ['repeated unclosed script prefixes', '<script'.repeat(20000), '']
    ])('processes %s safely in linear time', (_, input, expected) => {
      verifyLinearExecution(input, stripHtmlTags, (res) => expect(res).toBe(expected));
    });

    it('processes a 100,000-character string of spaces ending in x safely in linear time', () => {
      verifyLinearExecution(' '.repeat(100000) + 'x', stripHtmlTags, (output) => {
        expect(typeof output).toBe('string');
      });
    });

    it('processes 100,000-character adversarial inputs in Gemini prompt sanitization safely in linear time', () => {
      verifyLinearExecution('a'.repeat(100000) + '!', sanitizePromptText, (resA) => {
        expect(resA.length).toBe(600);
      });
      verifyLinearExecution(' '.repeat(100000) + 'x', sanitizePromptText, (resSpaces) => {
        expect(resSpaces).toBe('');
      });

      const typicalTagPrompt = 'Tell me about <script>alert(1)</script> air quality in <delhi>';
      expect(sanitizePromptText(typicalTagPrompt)).toBe('Tell me about alert(1) air quality in');
    });

    it('cleans normal HTML elements with attributes and nested tags', () => {
      expect(
        stripHtmlTags(
          '<div class="wrapper"><p>Indoor AQI: <span class="badge">Good</span></p></div>'
        )
      ).toBe('Indoor AQI: Good');
      expect(stripHtmlTags('<a href="https://example.org" target="_blank">Safe Link</a>')).toBe(
        'Safe Link'
      );
      expect(stripHtmlTags('<ul><li>Item 1</li><li>Item 2</li></ul>')).toBe('Item 1Item 2');
    });

    it('safely removes scripts with attributes, newlines, and mixed casing', () => {
      expect(
        stripHtmlTags('<SCRIPT type="text/javascript">var secret = 1;</SCRIPT>Retained text')
      ).toBe('Retained text');
      expect(stripHtmlTags('<script async src="tracker.js">\nconsole.log(1);\n</script>Safe')).toBe(
        'Safe'
      );
    });

    it('safely removes style tags with multi-line CSS and mixed casing', () => {
      expect(stripHtmlTags('<STYLE>\nbody { display: none; }\n</STYLE>Visible')).toBe('Visible');
      expect(stripHtmlTags('<style type="text/css">p { margin: 0; }</style>Content')).toBe(
        'Content'
      );
    });

    it('handles malformed, unclosed, and stray tags gracefully', () => {
      expect(stripHtmlTags('Valid text <div unclosed tag content')).toBe('Valid text');
      expect(stripHtmlTags('Text with lone > and lone <')).toBe('Text with lone  and lone');
      expect(stripHtmlTags('Closing tag only</span>')).toBe('Closing tag only');
      expect(stripHtmlTags('<>')).toBe('');
      expect(stripHtmlTags('<a')).toBe('');
    });

    it('respects maximum length cap (50,000 characters) on large inputs', () => {
      const largeText = 'Report '.repeat(15000);
      const cleaned = stripHtmlTags(largeText);
      expect(cleaned.length).toBeLessThanOrEqual(50000);
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
    it.each([
      [
        'accepts valid citizen report payload and normalizes fields',
        [
          'Anand Vihar ISBT',
          'Heavy diesel bus idling emitting dense plumes',
          'Citizen Watch',
          'Critical'
        ],
        { isValid: true, errCount: 0, location: 'Anand Vihar ISBT', urgency: 'Critical' }
      ],
      [
        'rejects payload with invalid location length',
        ['A', 'Valid issue description here', 'Tester', 'Medium'],
        { isValid: false, errText: 'Location must be at least 3 characters.' }
      ],
      [
        'rejects payload with missing or short issue',
        ['Rohini Sector 14', 'Bad', 'Tester', 'Low'],
        { isValid: false, errText: 'Issue description must be at least 5 characters.' }
      ],
      [
        'defaults invalid urgency levels to Medium',
        ['Okhla Phase 3', 'Factory chimney smoke without scrubbers', 'Resident', 'UNKNOWN_URGENCY'],
        { isValid: true, urgency: 'Medium' }
      ]
    ])('%s', (_, [location, issue, reporter, urgency], expected) => {
      const result = validateCitizenReport({ location, issue, reporter, urgency });
      expect(result.isValid).toBe(expected.isValid);
      if (expected.errCount !== undefined) {
        expect(result.errors.length).toBe(expected.errCount);
      }
      if (expected.errText) {
        expect(result.errors).toContain(expected.errText);
      }
      if (expected.location) {
        expect(result.sanitized.location).toBe(expected.location);
      }
      if (expected.urgency) {
        expect(result.sanitized.urgency).toBe(expected.urgency);
      }
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

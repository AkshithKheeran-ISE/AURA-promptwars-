import { describe, it, expect } from 'vitest';
import { basename } from 'node:path';
import lhciConfig from '../../lighthouserc.json';

describe('Lighthouse CI configuration', () => {
  it('audits the production preview build on localhost', () => {
    expect(lhciConfig.ci.collect.url).toEqual(['http://localhost:4173/']);
    expect(lhciConfig.ci.collect.startServerCommand).toContain('npm run preview');
    expect(lhciConfig.ci.collect.numberOfRuns).toBeGreaterThanOrEqual(2);
  });

  it('enforces accessibility and best-practices floors', () => {
    const assertions = lhciConfig.ci.assert.assertions;
    expect(assertions['categories:accessibility']).toEqual(['error', { minScore: 0.9 }]);
    expect(assertions['categories:best-practices']).toEqual(['error', { minScore: 0.9 }]);
  });

  it('measures performance without asserting it yet (baseline first)', () => {
    const assertions = lhciConfig.ci.assert.assertions;
    expect(assertions['categories:performance']).toBeUndefined();
    expect(lhciConfig.ci.collect.settings.onlyCategories).toContain('performance');
  });

  it('keeps reports local instead of uploading them', () => {
    expect(lhciConfig.ci.upload.target).toBe('filesystem');
  });

  it('writes reports to a non-hidden directory so CI can upload them', () => {
    // The CI workflow uploads this directory as an artifact. A hidden
    // directory (one starting with a dot, like the old .lighthouseci)
    // is invisible to the upload action's file search, so the step
    // ran green while uploading nothing (run #141, 2026-11-26).
    expect(basename(lhciConfig.ci.upload.outputDir).startsWith('.')).toBe(false);
  });
});

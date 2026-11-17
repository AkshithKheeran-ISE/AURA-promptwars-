import { describe, it, expect } from 'vitest';
import { IAQ_HACKS } from '../src/services/iaqHacks';

describe('Indoor Air Quality (IAQ) Hacks Catalog', () => {
  it('contains validated hacks with significant cost savings', () => {
    expect(IAQ_HACKS.length).toBeGreaterThanOrEqual(5);

    const corsiBox = IAQ_HACKS.find((h) => h.id === 'corsi_rosenthal');
    expect(corsiBox).toBeDefined();
    expect(corsiBox.costInr).toBeLessThan(2000);
    expect(corsiBox.commercialAlternativeInr).toBeGreaterThan(15000);
    expect(corsiBox.pm25ReductionPct).toBeGreaterThanOrEqual(90);
  });

  it('all hacks contain step-by-step instructions and scientific explanations', () => {
    IAQ_HACKS.forEach((hack) => {
      expect(hack.title).toBeTruthy();
      expect(hack.steps.length).toBeGreaterThan(2);
      expect(hack.scientificExplanation).toBeTruthy();
      expect(hack.badge).toBeTruthy();
    });
  });

  it('guarantees unique hack IDs and realistic engineering parameters', () => {
    const ids = IAQ_HACKS.map((h) => h.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    IAQ_HACKS.forEach((hack) => {
      expect(hack.costInr).toBeGreaterThanOrEqual(0);
      expect(hack.pm25ReductionPct).toBeGreaterThan(0);
      expect(hack.pm25ReductionPct).toBeLessThanOrEqual(100);
      expect(Array.isArray(hack.materials)).toBe(true);
      expect(hack.materials.length).toBeGreaterThan(0);
    });
  });
});

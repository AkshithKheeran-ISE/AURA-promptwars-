/**
 * Age-wise guidance: the same PM2.5 reading must mean different things
 * for different age groups, and a heart/lung condition must make any
 * group one step stricter — all grounded in the EPA band lower bounds
 * and the WHO 24-hour target, not invented numbers.
 */
import { describe, it, expect } from 'vitest';
import { AGE_GROUPS, guidanceForAgeGroup, guidanceForAllAges } from '../src/services/ageGuidance';

const snapshot = (pm25) => ({ pm25 });

describe('ageGuidance service', () => {
  it('exposes five age groups covering the whole lifespan', () => {
    expect(AGE_GROUPS.map((g) => g.id)).toEqual(['infant', 'child', 'teen', 'adult', 'senior']);
  });

  it('adult at PM2.5 10 µg/m³ is safe (below the EPA USG bound of 35.5)', () => {
    const g = guidanceForAgeGroup('adult', snapshot(10));
    expect(g.level).toBe('safe');
    expect(g.headline).toContain('Safe for this age group');
  });

  it('the same reading hits children harder: PM2.5 40 is caution for an adult but reduce for a child', () => {
    expect(guidanceForAgeGroup('adult', snapshot(40)).level).toBe('caution');
    expect(guidanceForAgeGroup('child', snapshot(40)).level).toBe('reduce');
    expect(guidanceForAgeGroup('infant', snapshot(40)).level).toBe('reduce');
    expect(guidanceForAgeGroup('senior', snapshot(40)).level).toBe('reduce');
  });

  it('teenagers 13–17 are sensitive, not healthy adults: PM2.5 40 is reduce for a teen, caution for an adult', () => {
    expect(guidanceForAgeGroup('teen', snapshot(40)).level).toBe('reduce');
    expect(guidanceForAgeGroup('teen', snapshot(20)).level).toBe('caution');
    expect(guidanceForAgeGroup('adult', snapshot(20)).level).toBe('safe');
    expect(guidanceForAgeGroup('teen', snapshot(40)).ageRange).toBe('13–17 years');
    expect(guidanceForAgeGroup('adult', snapshot(40)).ageRange).toBe('18–59 years');
  });

  it('an infant is already on caution just above the WHO target of 15 µg/m³', () => {
    expect(guidanceForAgeGroup('infant', snapshot(20)).level).toBe('caution');
    expect(guidanceForAgeGroup('infant', snapshot(14)).level).toBe('safe');
  });

  it('severe air: PM2.5 200 seals a senior indoors but only avoids exertion for a healthy adult', () => {
    expect(guidanceForAgeGroup('senior', snapshot(200)).level).toBe('sealed');
    expect(guidanceForAgeGroup('adult', snapshot(200)).level).toBe('avoid');
  });

  it('a heart/lung condition makes an adult one step stricter', () => {
    expect(guidanceForAgeGroup('adult', snapshot(20)).level).toBe('safe');
    expect(guidanceForAgeGroup('adult', snapshot(20), { hasCondition: true }).level).toBe(
      'caution'
    );
  });

  it('pregnancy makes an adult one step stricter, and the detail says so', () => {
    expect(guidanceForAgeGroup('adult', snapshot(20)).level).toBe('safe');
    const g = guidanceForAgeGroup('adult', snapshot(20), { isPregnant: true });
    expect(g.level).toBe('caution');
    expect(g.detail).toMatch(/Pregnancy is treated as sensitive/);
  });

  it('the detail names the hourly reading, not a 24-hour average', () => {
    expect(guidanceForAgeGroup('adult', snapshot(40)).detail).toMatch(/latest hourly reading/);
  });

  it('reports the WHO multiple and a mask/outdoor recommendation', () => {
    const g = guidanceForAgeGroup('child', snapshot(30));
    expect(g.whoMultiple).toBe(2);
    expect(g.outdoorMinutes).toMatch(/60 minutes/);
    expect(g.mask).toMatch(/No mask needed/);
    const severe = guidanceForAgeGroup('child', snapshot(300));
    expect(severe.mask).toMatch(/N95 required/);
    expect(severe.outdoorMinutes).toMatch(/emergency/);
  });

  it('returns null with no usable PM2.5 instead of guessing', () => {
    expect(guidanceForAgeGroup('adult', null)).toBeNull();
    expect(guidanceForAgeGroup('adult', {})).toBeNull();
    expect(guidanceForAgeGroup('adult', { pm25: 'not a number' })).toBeNull();
  });

  it('falls back to the adult group for an unknown group id', () => {
    expect(guidanceForAgeGroup('teenager', snapshot(40)).groupId).toBe('adult');
  });

  it('guidanceForAllAges returns one entry per group, all derived from the same reading', () => {
    const all = guidanceForAllAges(snapshot(40));
    expect(all).toHaveLength(5);
    expect(all.map((g) => g.level)).toEqual(['reduce', 'reduce', 'reduce', 'caution', 'reduce']);
    expect(guidanceForAllAges(null)).toEqual([]);
  });
});

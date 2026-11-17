import { describe, it, expect } from 'vitest';
import { 
  calculateInhaledExposure, 
  calculateCommunitySavings, 
  calculateHealthRiskIndex,
  EMISSION_FACTORS 
} from '../src/services/impactCalculator';

describe('Impact Calculator Service', () => {
  it('calculates inhaled PM2.5 exposure reduction with DIY HEPA & window weatherstripping', () => {
    const ambientPm25 = 300; // Severe winter smog (300 µg/m³)
    const hours = 8; // 8 hours of sleep

    const baseline = calculateInhaledExposure(ambientPm25, hours, false, false, 'none');
    const protectedExposure = calculateInhaledExposure(ambientPm25, hours, true, true, 'none');

    expect(baseline.standardInhaledMicrograms).toBe(1440);
    // With weatherstripping (0.35) and HEPA (0.12), indoor PM2.5 drops to ~13 µg/m³
    expect(protectedExposure.indoorPm25).toBeLessThan(25);
    expect(protectedExposure.percentageReduction).toBeGreaterThanOrEqual(90);
  });

  it('calculates community emissions avoided when switching to clean transit and heating', () => {
    const roundTripKm = 20;
    const savings = calculateCommunitySavings(roundTripKm, 'petrolCar', 'eRickshawMetro', true, true);

    expect(savings.co2SavedKg).toBeGreaterThan(15); // Transit + avoided sigdi + composted waste
    expect(savings.pm25SavedG).toBeGreaterThan(100); // Massive reduction vs open coal burning
    expect(savings.totalFinancialSavingsInr).toBeGreaterThan(0);
  });

  it('accurately scales health risk index for asthmatic seniors and infants', () => {
    const cleanAir = calculateHealthRiskIndex(20, false, false);
    expect(cleanAir.riskTier).toBe('Low Risk');
    expect(cleanAir.riskScore).toBeLessThan(3.0);

    const severeSmog = calculateHealthRiskIndex(280, true, true);
    expect(severeSmog.riskTier).toBe('Critical Hazard');
    expect(severeSmog.asthmaFlareUpProbability).toBeGreaterThan(80);
  });
});

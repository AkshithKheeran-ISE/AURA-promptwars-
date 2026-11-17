import { describe, it, expect } from 'vitest';
import {
  calculateInhaledExposure,
  calculateCommunitySavings,
  calculateHealthRiskIndex,
  EMISSION_FACTORS
} from '../src/services/impactCalculator';

describe('Impact Calculator Service (Scientific & Financial Accuracy)', () => {
  describe('Inhaled Exposure Calculations', () => {
    it('calculates inhaled PM2.5 exposure reduction with DIY HEPA & window weatherstripping', () => {
      const ambientPm25 = 300; // Severe winter smog (300 µg/m³)
      const hours = 8; // 8 hours nocturnal sleep

      const baseline = calculateInhaledExposure(ambientPm25, hours, false, false, 'none');
      const protectedExposure = calculateInhaledExposure(ambientPm25, hours, true, true, 'none');

      expect(baseline.standardInhaledMicrograms).toBe(1440);
      // With weatherstripping (0.35) and Corsi/HEPA (0.10), indoor PM2.5 drops to ~11 µg/m³
      expect(protectedExposure.indoorPm25).toBeLessThanOrEqual(15);
      expect(protectedExposure.percentageReduction).toBeGreaterThanOrEqual(90);
    });

    it('safely handles invalid, NaN, negative, and extreme boundary inputs without crashing', () => {
      const negativeResult = calculateInhaledExposure(-50, -5, false, false, 'none');
      expect(negativeResult.standardInhaledMicrograms).toBe(0);
      expect(negativeResult.percentageReduction).toBe(0);

      const nanResult = calculateInhaledExposure('invalid', null, false, false);
      expect(nanResult.standardInhaledMicrograms).toBeGreaterThanOrEqual(0);
      expect(isNaN(nanResult.indoorPm25)).toBe(false);

      const extremeResult = calculateInhaledExposure(99999, 999, true, true);
      expect(extremeResult.indoorPm25).toBeLessThanOrEqual(100); // clamped to 1000 * 0.10
    });
  });

  describe('Community Emissions & Financial Savings', () => {
    it('calculates community emissions avoided when switching to clean transit and heating', () => {
      const roundTripKm = 20;
      const savings = calculateCommunitySavings(
        roundTripKm,
        'petrolCar',
        'eRickshawMetro',
        true,
        true
      );

      expect(savings.co2SavedKg).toBeGreaterThan(15); // Transit + avoided sigdi + composted waste
      expect(savings.pm25SavedG).toBeGreaterThan(100);
      expect(savings.totalFinancialSavingsInr).toBeGreaterThan(0);
      expect(savings.breakdown.fuelSavingsInr).toBeGreaterThan(0);
      expect(savings.breakdown.healthSavingsInr).toBeGreaterThan(0);
    });

    it('strictly isolates categories and returns 0 savings for unselected habits', () => {
      // User only changes transit, does NOT do heating or waste composting
      const transitOnly = calculateCommunitySavings(
        20,
        'petrolCar',
        'eRickshawMetro',
        false, // avoidedBiomassHeating = false
        false // compostedWaste = false
      );

      expect(transitOnly.breakdown.co2HeatingKg).toBe(0);
      expect(transitOnly.breakdown.co2WasteKg).toBe(0);
      expect(transitOnly.co2SavedKg).toBe(transitOnly.breakdown.co2TransitKg);

      // When distance is 0 or modes are identical, transit savings must be strictly 0
      const zeroDistance = calculateCommunitySavings(0, 'petrolCar', 'eRickshawMetro', false, false);
      expect(zeroDistance.co2SavedKg).toBe(0);
      expect(zeroDistance.pm25SavedG).toBe(0);
      expect(zeroDistance.totalFinancialSavingsInr).toBe(0);
    });
  });

  describe('Objective Health Vulnerability Index', () => {
    it('accurately benchmarks against WHO 2021 air quality target (15 µg/m³)', () => {
      const cleanAir = calculateHealthRiskIndex(15, false, false);
      expect(cleanAir.riskTier).toBe('Minimal Impact');
      expect(cleanAir.whoTargetExceedance).toBe('1× WHO Target');

      const severeSmog = calculateHealthRiskIndex(300, true, true);
      expect(severeSmog.riskTier).toBe('Severe Environmental Hazard');
      expect(severeSmog.whoTargetExceedance).toBe('20× WHO Target');
    });
  });

  describe('CPCB / EPA Emission Factors Reference Standards', () => {
    it('exposes baseline CPCB/EPA emission factors for transit, heating, and waste', () => {
      expect(EMISSION_FACTORS.transit.petrolCar.co2Kg).toBeGreaterThan(0.1);
      expect(EMISSION_FACTORS.heating.woodCoalSigdi.pm25G).toBe(120.0);
      expect(EMISSION_FACTORS.waste.openBiomassBurning10Kg.co2Kg).toBe(18.5);
    });
  });
});

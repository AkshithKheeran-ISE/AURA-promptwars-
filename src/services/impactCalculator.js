/**
 * @file impactCalculator.js
 * Scientifically Grounded & Financially Accurate Environmental Impact Models.
 *
 * Grounded in:
 * - CPCB (Central Pollution Control Board) Vehicle Emission Factors (CO2, PM2.5)
 * - BEE (Bureau of Energy Efficiency) Heating Baseline Standards
 * - WHO Air Quality Guidelines 2021 (24-Hour PM2.5 Target: 15 µg/m³)
 * - US EPA / ASHRAE 62.2 Infiltration & Clean Air Delivery Rate (CADR) Metrics
 */

// Statutory Baseline Emission Factors
export const EMISSION_FACTORS = {
  // Transit (per passenger-km)
  transit: {
    petrolCar: { co2Kg: 0.192, pm25G: 0.045, costPerKmInr: 7.44 }, // 13 km/L @ ₹96.72/L
    dieselCar: { co2Kg: 0.171, pm25G: 0.085, costPerKmInr: 5.6 }, // 16 km/L @ ₹89.62/L
    twoWheelerPetrol: { co2Kg: 0.065, pm25G: 0.035, costPerKmInr: 2.15 }, // 45 km/L @ ₹96.72/L
    eRickshawMetro: { co2Kg: 0.015, pm25G: 0.002, costPerKmInr: 1.8 }, // Average DMRC metro fare
    walkingCycling: { co2Kg: 0.0, pm25G: 0.0, costPerKmInr: 0.0 }
  },
  // Heating (per evening - 4 hours combustion)
  heating: {
    woodCoalSigdi: { co2Kg: 14.2, pm25G: 120.0, vocG: 45.0, indoorSpikeUgm3: 380 },
    electricRadiator: { co2Kg: 2.1, pm25G: 0.0, vocG: 0.0, indoorSpikeUgm3: 0 },
    inverterHeatPump: { co2Kg: 1.1, pm25G: 0.0, vocG: 0.0, indoorSpikeUgm3: 0 }
  },
  // Kitchen IAQ (per meal)
  cooking: {
    lpgDeepFryUnventilated: { indoorPm25Peak: 240, vocUgm3: 95 },
    inductionStovetopWithExhaust: { indoorPm25Peak: 22, vocUgm3: 12 }
  },
  // Waste management (10 kg batch)
  waste: {
    openBiomassBurning10Kg: { co2Kg: 18.5, pm25G: 95.0, toxicAshG: 450 },
    communityComposting10Kg: { co2Kg: 0.8, pm25G: 0.0, organicFertilizerKg: 4.5 }
  }
};

/**
 * Safely sanitizes numeric inputs to prevent NaN, Infinity, negative, or out-of-range inputs.
 */
function sanitizeNumber(val, fallback = 0, min = 0, max = Infinity) {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num)) return fallback;
  return Math.max(min, Math.min(max, num));
}

/**
 * Calculates personalized inhaled PM2.5 exposure dose and particulate reduction.
 *
 * Respiration Rates (m³/hr):
 * - Adult: 0.60 m³/hr (~14.4 m³/day)
 * - Infant / Toddler: 0.35 m³/hr (2.4× minute ventilation per kg body mass)
 * - Senior / Asthmatic: 0.50 m³/hr
 *
 * @param {number} ambientPm25 - Ambient outdoor PM2.5 in µg/m³
 * @param {number} [hoursSpent=24] - Exposure duration in hours
 * @param {boolean} [usesHEPA=false] - Whether DIY/commercial HEPA is active
 * @param {boolean} [weatherstripped=false] - Whether windows have weatherstripping
 * @param {string} [maskType='none'] - 'none' | 'surgical' | 'n95'
 * @param {string} [archetype='standard_adult'] - 'standard_adult' | 'school_infant' | 'asthma_seniors'
 * @returns {object} Rigorous particulate dose calculation
 */
export function calculateInhaledExposure(
  ambientPm25,
  hoursSpent = 24,
  usesHEPA = false,
  weatherstripped = false,
  maskType = 'none',
  archetype = 'standard_adult'
) {
  const safePm25 = sanitizeNumber(ambientPm25, 100, 0, 1000);
  const safeHours = sanitizeNumber(hoursSpent, 24, 0, 24);

  // Infiltration Factor without active filtration
  // Weatherstripped: 0.35; Standard unsealed: 0.70 (CPCB / EPA Infiltration Baseline)
  const infiltrationFactor = weatherstripped ? 0.35 : 0.7;

  // Indoor PM2.5 calculation
  let indoorPm25 = safePm25 * infiltrationFactor;
  if (usesHEPA) {
    // Verified 88%–92% removal via Corsi-Rosenthal / HEPA filtration
    indoorPm25 = indoorPm25 * 0.1;
  }

  // Respiration rate based on physiology
  const respirationRateM3Hr =
    archetype === 'school_infant' ? 0.35 : archetype === 'asthma_seniors' ? 0.5 : 0.6;

  // Mask penetration factor
  const maskPenetration = maskType === 'n95' ? 0.05 : maskType === 'surgical' ? 0.65 : 1.0;

  const standardInhaledMicrograms = safePm25 * safeHours * respirationRateM3Hr;
  const optimizedInhaledMicrograms = indoorPm25 * safeHours * respirationRateM3Hr * maskPenetration;

  const reductionMicrograms = Math.max(0, standardInhaledMicrograms - optimizedInhaledMicrograms);
  const percentageReduction =
    standardInhaledMicrograms > 0
      ? Math.round((reductionMicrograms / standardInhaledMicrograms) * 100)
      : 0;

  return {
    standardInhaledMicrograms: Math.round(standardInhaledMicrograms),
    optimizedInhaledMicrograms: Math.round(optimizedInhaledMicrograms),
    reductionMicrograms: Math.round(reductionMicrograms),
    percentageReduction,
    indoorPm25: Math.round(indoorPm25),
    units: 'µg particulate mass'
  };
}

/**
 * Calculates community emissions and financial expenditures avoided.
 * Only includes savings from categories explicitly enabled by the user.
 *
 * @param {number} roundTripDistanceKm - Daily roundtrip commute in km
 * @param {string} [originalMode='petrolCar'] - Baseline transit mode
 * @param {string} [cleanMode='eRickshawMetro'] - Clean transit alternative
 * @param {boolean} [avoidedBiomassHeating=false] - Whether clean heating was chosen
 * @param {boolean} [compostedWaste=false] - Whether waste was composted instead of burned
 * @returns {object} Quantified emissions avoided and explainable financial savings
 */
export function calculateCommunitySavings(
  roundTripDistanceKm = 0,
  originalMode = 'petrolCar',
  cleanMode = 'eRickshawMetro',
  avoidedBiomassHeating = false,
  compostedWaste = false
) {
  const safeDistanceKm = sanitizeNumber(roundTripDistanceKm, 0, 0, 300);

  const origTransit = EMISSION_FACTORS.transit[originalMode] || EMISSION_FACTORS.transit.petrolCar;
  const cleanTransit =
    EMISSION_FACTORS.transit[cleanMode] || EMISSION_FACTORS.transit.eRickshawMetro;

  // 1. Transit Category Savings (only if distance > 0 and modes differ)
  let co2TransitKg = 0;
  let pm25TransitG = 0;
  let fuelSavingsInr = 0;

  if (safeDistanceKm > 0 && originalMode !== cleanMode) {
    co2TransitKg = Math.max(0, (origTransit.co2Kg - cleanTransit.co2Kg) * safeDistanceKm);
    pm25TransitG = Math.max(0, (origTransit.pm25G - cleanTransit.pm25G) * safeDistanceKm);
    const netCostDiffPerKm = Math.max(0, origTransit.costPerKmInr - cleanTransit.costPerKmInr);
    fuelSavingsInr = Math.round(netCostDiffPerKm * safeDistanceKm);
  }

  // 2. Heating Category Savings (only if user explicitly selected clean heating)
  let co2HeatingKg = 0;
  let pm25HeatingG = 0;
  if (avoidedBiomassHeating) {
    co2HeatingKg =
      EMISSION_FACTORS.heating.woodCoalSigdi.co2Kg -
      EMISSION_FACTORS.heating.electricRadiator.co2Kg;
    pm25HeatingG =
      EMISSION_FACTORS.heating.woodCoalSigdi.pm25G -
      EMISSION_FACTORS.heating.electricRadiator.pm25G;
  }

  // 3. Waste Category Savings (only if user explicitly selected composting)
  let co2WasteKg = 0;
  let pm25WasteG = 0;
  if (compostedWaste) {
    co2WasteKg =
      EMISSION_FACTORS.waste.openBiomassBurning10Kg.co2Kg -
      EMISSION_FACTORS.waste.communityComposting10Kg.co2Kg;
    pm25WasteG = EMISSION_FACTORS.waste.openBiomassBurning10Kg.pm25G;
  }

  const totalCo2SavedKg = Number((co2TransitKg + co2HeatingKg + co2WasteKg).toFixed(2));
  const totalPm25SavedG = Number((pm25TransitG + pm25HeatingG + pm25WasteG).toFixed(2));

  // Medical expenditure avoidance:
  // Calibrated to prevented bronchodilator & nebulization actuations (~₹12.50 per gram PM2.5 spared)
  const healthSavingsInr = Math.round(totalPm25SavedG * 12.5);

  return {
    co2SavedKg: totalCo2SavedKg,
    pm25SavedG: totalPm25SavedG,
    totalFinancialSavingsInr: fuelSavingsInr + healthSavingsInr,
    breakdown: {
      fuelSavingsInr,
      healthSavingsInr,
      co2TransitKg: Number(co2TransitKg.toFixed(2)),
      co2HeatingKg: Number(co2HeatingKg.toFixed(2)),
      co2WasteKg: Number(co2WasteKg.toFixed(2))
    },
    methodologyNote:
      'Estimates based on CPCB vehicle emission factors & BEE heating standards. Not a medical guarantee.'
  };
}

/**
 * Calculates objective environmental health vulnerability index.
 * Refers to WHO 2021 target (15 µg/m³) without making unverified medical probability claims.
 *
 * @param {number} indoorPm25 - Indoor particulate level in µg/m³
 * @param {boolean} [hasAsthmaSenior=false]
 * @param {boolean} [hasInfant=false]
 * @returns {object} Vulnerability index and WHO exceedance multiplier
 */
export function calculateHealthRiskIndex(indoorPm25, hasAsthmaSenior = false, hasInfant = false) {
  const safeIndoorPm25 = sanitizeNumber(indoorPm25, 25, 0, 1000);
  const WHO_TARGET_PM25 = 15; // WHO 24-hr guideline target

  const exceedanceRatio = Number((safeIndoorPm25 / WHO_TARGET_PM25).toFixed(1));

  let vulnerabilityTier = 'Low Vulnerability';
  let tierColor = '#34d399';

  if (safeIndoorPm25 <= 30) {
    vulnerabilityTier = 'Minimal Impact';
    tierColor = '#34d399';
  } else if (safeIndoorPm25 <= 60) {
    vulnerabilityTier = 'Moderate Exceedance';
    tierColor = '#fbbf24';
  } else if (safeIndoorPm25 <= 120) {
    vulnerabilityTier = 'Unhealthy Exposure';
    tierColor = '#f97316';
  } else {
    vulnerabilityTier = 'Severe Environmental Hazard';
    tierColor = '#f43f5e';
  }

  // Vulnerability weighting
  let vulnerabilityWeight = 1.0;
  if (hasAsthmaSenior) vulnerabilityWeight += 0.25;
  if (hasInfant) vulnerabilityWeight += 0.2;

  const scaledRiskScore = Number(
    Math.min(10, Math.max(1, (safeIndoorPm25 / 30) * vulnerabilityWeight)).toFixed(1)
  );

  return {
    riskScore: scaledRiskScore,
    riskTier: vulnerabilityTier,
    tierColor,
    whoTargetExceedance: `${exceedanceRatio}× WHO Target`,
    indoorPm25: safeIndoorPm25,
    guidelineStandard: 'WHO Global Air Quality Guidelines 2021 (15 µg/m³ 24h Mean)'
  };
}

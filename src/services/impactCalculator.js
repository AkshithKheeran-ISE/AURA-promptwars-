/**
 * @file impactCalculator.js
 * Mathematical models for calculating personal exposure reduction,
 * community emission avoidance, and health risk mitigation.
 */

// Baseline emission factors (CPCB / EPA Standards)
export const EMISSION_FACTORS = {
  // Transit (per km)
  transit: {
    petrolCar: { co2Kg: 0.192, pm25G: 0.045, noxG: 0.38 },
    dieselCar: { co2Kg: 0.171, pm25G: 0.085, noxG: 0.65 },
    twoWheelerPetrol: { co2Kg: 0.065, pm25G: 0.035, noxG: 0.22 },
    eRickshawMetro: { co2Kg: 0.015, pm25G: 0.002, noxG: 0.03 },
    walkingCycling: { co2Kg: 0.0, pm25G: 0.0, noxG: 0.0 }
  },
  // Heating (per evening - 4 hours)
  heating: {
    woodCoalSigdi: { co2Kg: 14.2, pm25G: 120.0, vocG: 45.0, indoorSpikeUgm3: 380 },
    electricRadiator: { co2Kg: 2.1, pm25G: 0.0, vocG: 0.0, indoorSpikeUgm3: 0 },
    inverterHeatPump: { co2Kg: 1.1, pm25G: 0.0, vocG: 0.0, indoorSpikeUgm3: 0 }
  },
  // Cooking & Kitchen IAQ (per meal)
  cooking: {
    lpgDeepFryUnventilated: { indoorPm25Peak: 240, vocUgm3: 95 },
    inductionStovetopWithExhaust: { indoorPm25Peak: 22, vocUgm3: 12 }
  },
  // Waste management
  waste: {
    openBiomassBurning10Kg: { co2Kg: 18.5, pm25G: 95.0, toxicAshG: 450 },
    communityComposting10Kg: { co2Kg: 0.8, pm25G: 0.0, organicFertilizerKg: 4.5 }
  }
};

/**
 * Calculate personal inhaled PM2.5 exposure reduction
 * @param {number} ambientPm25 - Ambient outdoor PM2.5 in µg/m³
 * @param {number} hoursSpent - Hours spent in environment
 * @param {boolean} usesHEPA - Whether DIY/commercial HEPA is active
 * @param {boolean} weatherstripped - Whether windows are weatherstripped
 * @param {string} maskType - 'none' | 'surgical' | 'n95'
 * @returns {object} Calculated exposure and percentage reduction
 */
export function calculateInhaledExposure(
  ambientPm25,
  hoursSpent,
  usesHEPA,
  weatherstripped,
  maskType = 'none'
) {
  // Infiltration factor without air purification
  let infiltrationFactor = weatherstripped ? 0.35 : 0.7;

  // Indoor PM2.5 calculation
  let indoorPm25 = ambientPm25 * infiltrationFactor;
  if (usesHEPA) {
    indoorPm25 = indoorPm25 * 0.12; // 88% clearance with DIY Corsi-Rosenthal or HEPA
  }

  // Outdoor mask protection factor
  let maskPenetration = maskType === 'n95' ? 0.05 : maskType === 'surgical' ? 0.65 : 1.0;

  // Average human respiration rate = ~0.6 m³ air per hour
  const respirationRateM3Hr = 0.6;
  const standardInhaledMicrograms = ambientPm25 * hoursSpent * respirationRateM3Hr;
  const optimizedInhaledMicrograms =
    indoorPm25 * hoursSpent * respirationRateM3Hr * maskPenetration;

  const reductionMicrograms = Math.max(0, standardInhaledMicrograms - optimizedInhaledMicrograms);
  const percentageReduction =
    Math.round((reductionMicrograms / standardInhaledMicrograms) * 100) || 0;

  return {
    standardInhaledMicrograms: Math.round(standardInhaledMicrograms),
    optimizedInhaledMicrograms: Math.round(optimizedInhaledMicrograms),
    reductionMicrograms: Math.round(reductionMicrograms),
    percentageReduction,
    indoorPm25: Math.round(indoorPm25)
  };
}

/**
 * Calculate community emissions avoided by choosing sustainable routines
 * @param {number} roundTripDistanceKm - Daily roundtrip commute in km
 * @param {string} originalMode - 'petrolCar' | 'dieselCar' | 'twoWheelerPetrol'
 * @param {string} cleanMode - 'eRickshawMetro' | 'walkingCycling'
 * @param {boolean} avoidedBiomassHeating - Whether clean heating was chosen
 * @param {boolean} compostedWaste - Whether waste was composted instead of burned
 * @returns {object} Savings in CO2 (kg), PM2.5 (g), and monetary savings (INR)
 */
export function calculateCommunitySavings(
  roundTripDistanceKm,
  originalMode = 'petrolCar',
  cleanMode = 'eRickshawMetro',
  avoidedBiomassHeating = true,
  compostedWaste = true
) {
  const origTransit = EMISSION_FACTORS.transit[originalMode] || EMISSION_FACTORS.transit.petrolCar;
  const cleanTransit =
    EMISSION_FACTORS.transit[cleanMode] || EMISSION_FACTORS.transit.eRickshawMetro;

  // Transit savings
  const co2TransitKg = (origTransit.co2Kg - cleanTransit.co2Kg) * roundTripDistanceKm;
  const pm25TransitG = (origTransit.pm25G - cleanTransit.pm25G) * roundTripDistanceKm;

  // Heating savings (per day)
  const co2HeatingKg = avoidedBiomassHeating
    ? EMISSION_FACTORS.heating.woodCoalSigdi.co2Kg - EMISSION_FACTORS.heating.electricRadiator.co2Kg
    : 0;
  const pm25HeatingG = avoidedBiomassHeating
    ? EMISSION_FACTORS.heating.woodCoalSigdi.pm25G - EMISSION_FACTORS.heating.electricRadiator.pm25G
    : 0;

  // Waste savings
  const co2WasteKg = compostedWaste
    ? EMISSION_FACTORS.waste.openBiomassBurning10Kg.co2Kg -
      EMISSION_FACTORS.waste.communityComposting10Kg.co2Kg
    : 0;
  const pm25WasteG = compostedWaste ? EMISSION_FACTORS.waste.openBiomassBurning10Kg.pm25G : 0;

  const totalCo2SavedKg = Number((co2TransitKg + co2HeatingKg + co2WasteKg).toFixed(2));
  const totalPm25SavedG = Number((pm25TransitG + pm25HeatingG + pm25WasteG).toFixed(2));

  // Approximate financial savings on fuel & medicines
  const fuelSavingsInr = Math.round(roundTripDistanceKm * 8.5); // avg petrol savings
  const healthSavingsInr = Math.round(totalPm25SavedG * 12.0); // reduced medication/nebulizer costs

  return {
    co2SavedKg: totalCo2SavedKg,
    pm25SavedG: totalPm25SavedG,
    totalFinancialSavingsInr: fuelSavingsInr + healthSavingsInr
  };
}

/**
 * Calculate pediatric and senior respiratory health risk score
 * @param {number} indoorPm25 - Indoor PM2.5 in µg/m³
 * @param {boolean} hasAsthmaSenior - Senior with chronic respiratory condition
 * @param {boolean} hasInfant - Children under 5 in household
 * @returns {object} Health risk level and prevention metrics
 */
export function calculateHealthRiskIndex(indoorPm25, hasAsthmaSenior = true, hasInfant = true) {
  let riskScore = 1.0;

  // Exponential scaling based on particulate concentration
  if (indoorPm25 <= 30) riskScore = 1.2;
  else if (indoorPm25 <= 60) riskScore = 2.8;
  else if (indoorPm25 <= 120) riskScore = 5.4;
  else if (indoorPm25 <= 250) riskScore = 8.2;
  else riskScore = 9.8;

  if (hasAsthmaSenior) riskScore = Math.min(10, riskScore * 1.25);
  if (hasInfant) riskScore = Math.min(10, riskScore * 1.2);

  const riskTier =
    riskScore <= 3
      ? 'Low Risk'
      : riskScore <= 6
        ? 'Moderate Vulnerability'
        : riskScore <= 8.5
          ? 'High Alert'
          : 'Critical Hazard';

  return {
    riskScore: Number(riskScore.toFixed(1)),
    riskTier,
    asthmaFlareUpProbability: Math.min(95, Math.round(riskScore * 9.5)),
    respiratoryReliefPct: Math.round(Math.max(5, 100 - (indoorPm25 / 280) * 100))
  };
}

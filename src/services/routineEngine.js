/**
 * @file routineEngine.js
 * Generates low-emission, smog-adapted daily routines tailored to
 * family composition, dwelling type, and atmospheric inversion cycles.
 */

export const FAMILY_ARCHETYPES = [
  {
    id: 'school_infant',
    label: 'Family with Schoolchildren & Infants',
    vulnerabilities: ['Immature alveolar lung architecture', 'Higher respiration rate per body weight'],
    priorityPollutant: 'PM2.5 & Ultrafine combustion particles'
  },
  {
    id: 'asthma_seniors',
    label: 'Multi-Generational with Asthmatic Senior',
    vulnerabilities: ['Pre-existing COPD / Cardiovascular risk', 'Bronchial spasms during cold morning smog'],
    priorityPollutant: 'PM2.5 & Nitrogen Dioxide (NO2)'
  },
  {
    id: 'daily_commuter',
    label: 'Working Parents & Outdoor Commuters',
    vulnerabilities: ['Street canyon diesel soot exposure', 'Peak traffic rush hour stagnation'],
    priorityPollutant: 'Black Carbon & Volatile Organic Compounds'
  },
  {
    id: 'rwa_community',
    label: 'Housing Society / Neighborhood Community',
    vulnerabilities: ['Neighbor open waste smoldering', 'High-density backup generator pollution'],
    priorityPollutant: 'Sulfur Dioxide & Smoldering Biomass'
  }
];

export const DAILY_ROUTINE_SLOTS = [
  {
    timeSlot: '06:30 – 08:30',
    title: 'Morning Awakening & School Commute Window',
    smogCondition: 'Peak Nocturnal Inversion Trap (AQI 340+)',
    inversionHeight: '80m (Severe Stagnation)',
    standardPractice: 'Open bedroom windows for "fresh morning air" and ride open scooters to school.',
    smogHackRoutine: 'Keep windows strictly sealed. Run DIY HEPA on bedroom. Travel via closed Metro feeder or carpool with cabin recirculation ON.',
    impactExplanation: 'Prevents direct inhalation of 85 µg of fine soot during peak cold air pooling.',
    actionBadge: 'STRICT WINDOW SEAL',
    badgeColor: '#f43f5e'
  },
  {
    timeSlot: '09:00 – 12:00',
    title: 'Work Hours & Indoor Housekeeping',
    smogCondition: 'Gradual Solar Heating Dissolving Surface Layer',
    inversionHeight: '140m – 220m',
    standardPractice: 'Dry sweeping with broom (resuspending 400 µg coarse dust) and outdoor clothes drying.',
    smogHackRoutine: 'Microfiber damp wet-mopping only. Dry clothes indoors with ceiling fan/dehumidifier so outdoor particulate soot does not coat baby blankets.',
    impactExplanation: 'Eliminates 75% of indoor dust resuspension and protects infant skin from acidic soot.',
    actionBadge: 'WET-MOPPING ONLY',
    badgeColor: '#fbbf24'
  },
  {
    timeSlot: '13:30 – 15:30',
    title: 'Golden Ventilation & Outdoor Errand Window',
    smogCondition: 'Maximum Convective Mixing (Clearest Air of the Day)',
    inversionHeight: '380m – 480m (Inversion Broken)',
    standardPractice: 'Keeping house perpetually shut with stale CO2 building up above 1,500 ppm.',
    smogHackRoutine: 'Cross-ventilate house for exactly 45 minutes using HEPA pre-filters on intake windows. Best window for outdoor grocery walks or terrace garden tasks.',
    impactExplanation: 'Flushes indoor stale carbon dioxide while ambient PM2.5 is at its lowest daily diurnal trough.',
    actionBadge: 'VENTILATION WINDOW',
    badgeColor: '#34d399'
  },
  {
    timeSlot: '17:30 – 20:00',
    title: 'Evening Return Commute & Dinner Prep',
    smogCondition: 'Secondary Traffic Ingress Peak & Rapid Ground Cooling',
    inversionHeight: '110m (Re-compressing Inversion)',
    standardPractice: 'Deep frying on unventilated gas stove while children study in adjacent dining room.',
    smogHackRoutine: 'Turn on kitchen exhaust 3 minutes before lighting induction stove. Keep kitchen door shut to prevent oil smoke migration into bedrooms.',
    impactExplanation: 'Prevents a 240 µg/m³ indoor particulate spike that triggers nocturnal pediatric coughing.',
    actionBadge: 'KITCHEN ISOLATION',
    badgeColor: '#fb923c'
  },
  {
    timeSlot: '21:00 – 06:30',
    title: 'Night Sleep & Mucosal Membrane Restoration',
    smogCondition: 'Critical Nocturnal Thermal Trapping',
    inversionHeight: '70m – 90m (Hazardous)',
    standardPractice: 'Unregulated heating with biomass sigdi or dry electric coil fan heater.',
    smogHackRoutine: 'Operate oil-filled radiator or clean convection heater. Maintain indoor relative humidity at 45–55% using wet cotton towel or ultrasonic humidifier. Run DIY Corsi box on silent mode.',
    impactExplanation: 'Preserves mucosal airway hydration and eliminates nocturnal bronchospasms for asthmatic seniors.',
    actionBadge: 'REST & HEPA SILENT',
    badgeColor: '#22d3ee'
  }
];

/**
 * Generate customized advice based on ambient AQI and family profile
 */
export function generatePersonalizedGuidance(archetypeId, currentAqi) {
  const isExtreme = currentAqi > 300;
  
  if (archetypeId === 'school_infant') {
    return {
      title: 'Pediatric Defense Protocol Active',
      keyRule: isExtreme ? 'Mandate school indoor confinement. N95 respirator mandatory during transit.' : 'Limit outdoor playtime to afternoon window (14:00 - 15:30).',
      hepaSetting: isExtreme ? 'High / Continuous Turbo' : 'Auto / Medium',
      avoidAction: 'Avoid early morning school bus waiting on unpaved road dust curbs.'
    };
  }

  if (archetypeId === 'asthma_seniors') {
    return {
      title: 'Senior Bronchial Shield Protocol',
      keyRule: 'Strictly avoid morning balcony walks before 10:30 AM. Cold morning air causes sudden bronchoconstriction.',
      hepaSetting: 'Continuous Bedroom Air Cleaning',
      avoidAction: 'Do not use open coil electric blowers that burn dust into toxic ultra-fines.'
    };
  }

  return {
    title: 'Community Clean Commute Protocol',
    keyRule: 'Shift to Metro / electric carpool. Turn on vehicle internal air recirculation.',
    hepaSetting: 'Timed Evening Cycle',
    avoidAction: 'Avoid two-wheeler commutes along unpaved industrial bypasses.'
  };
}

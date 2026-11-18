/**
 * Configuration and constant definitions for AURA Verifiable Multi-Agent System.
 */

export const FAMILY_AGENTS_ROSTER = [
  {
    id: 'family_advisor',
    name: 'FamilyAdvisor',
    role: 'Lifestyle & Schedule Customizer',
    sampleQuery:
      'What diurnal daily smog schedule should our family follow to minimize inhaled PM2.5?',
    avatarColor: '#22d3ee',
    desc: 'Analyzes household composition, school timings, and commute routes to generate low-exposure diurnal schedules.'
  },
  {
    id: 'iaq_engineer',
    name: 'IAQEngineer',
    role: 'DIY Air Purifier & Hack Architect',
    sampleQuery: 'How do I build a low-cost DIY Corsi-Rosenthal box air purifier for ₹1,450?',
    avatarColor: '#34d399',
    desc: 'Provides blueprints for DIY Corsi-Rosenthal boxes, window draft weatherstripping, and kitchen ventilation isolation.'
  },
  {
    id: 'pediatric_shield',
    name: 'PediatricShield',
    role: 'Child & Senior Bronchial Protection',
    sampleQuery:
      'What specific airway protection actions should we take for an infant and asthmatic senior?',
    avatarColor: '#f43f5e',
    desc: 'Calculates sub-micron soot deposition in pediatric lungs, flags school sports hazard windows, and optimizes N95 respirator fit.'
  },
  {
    id: 'meteo_forecaster',
    name: 'MeteoForecaster',
    role: 'Boundary Inversion & Window Timing',
    sampleQuery: 'When is the safest diurnal window to open windows for cross-ventilation?',
    avatarColor: '#a855f7',
    desc: 'Monitors the nocturnal radiation inversion depth (70m - 120m) to pinpoint the exact 45-minute afternoon window to safely ventilate.'
  },
  {
    id: 'eco_auditor',
    name: 'EcoAuditor',
    role: 'Explainable Direct Impact Calculator',
    sampleQuery:
      'What is the direct carbon and soot savings if our family takes the Metro and swaps coal sigdi for a radiator?',
    avatarColor: '#fbbf24',
    desc: 'Quantifies exact kilograms of CO2 avoided, grams of toxic PM2.5 spared, and medical rupees saved by your family’s clean choices.'
  },
  {
    id: 'community_watch',
    name: 'CommunityWatch',
    role: 'Tamper-Evident Hazard Watchdog',
    sampleQuery:
      'How does the SHA-256 community ledger protect neighborhood air hazard reports from tampering?',
    avatarColor: '#38bdf8',
    desc: 'Validates SHA-256 citizen reports on neighborhood biomass burning, illegal generator smoke, and construction dust.'
  }
];

export const SAMPLE_QUERIES = [
  'How do I build a low-cost DIY Corsi-Rosenthal box air purifier for ₹1,450?',
  'What daily smog routine should I follow for my infant and asthmatic senior?',
  'When is the safest time of day to open windows for ventilation?',
  'What is the direct carbon and soot savings if our family takes the Metro?',
  'Why is open coal sigdi heating dangerous and what is the clean alternative?'
];

export const SATELLITE_AGENTS_CONFIG = [
  {
    agentId: 'family_advisor',
    rosterIndex: 0,
    posClass: 'left-[8%] top-[12%]',
    borderClass: 'border-cyan-400/40',
    textClass: 'text-cyan-300',
    fallbackLabel: 'Routines & Commute'
  },
  {
    agentId: 'iaq_engineer',
    rosterIndex: 1,
    posClass: 'right-[8%] top-[12%]',
    borderClass: 'border-emerald-400/40',
    textClass: 'text-emerald-300',
    fallbackLabel: 'DIY Corsi & Hacks'
  },
  {
    agentId: 'pediatric_shield',
    rosterIndex: 2,
    posClass: 'left-[3%] top-[45%]',
    borderClass: 'border-rose-500/40',
    textClass: 'text-rose-400',
    fallbackLabel: 'Infant & Asthmatic Lung'
  },
  {
    agentId: 'meteo_forecaster',
    rosterIndex: 3,
    posClass: 'right-[3%] top-[45%]',
    borderClass: 'border-purple-500/40',
    textClass: 'text-purple-300',
    fallbackLabel: 'Inversion & Timing'
  },
  {
    agentId: 'eco_auditor',
    rosterIndex: 4,
    posClass: 'left-[10%] bottom-[12%]',
    borderClass: 'border-amber-400/40',
    textClass: 'text-amber-300',
    fallbackLabel: 'Direct Impact Metric'
  },
  {
    agentId: 'community_watch',
    rosterIndex: 5,
    posClass: 'right-[10%] bottom-[12%]',
    borderClass: 'border-sky-400/40',
    textClass: 'text-sky-300',
    fallbackLabel: 'Tamper-Proof Ledger'
  }
];

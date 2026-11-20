/**
 * @file src/constants/index.js
 * Domain and physical constants for atmospheric science calculations,
 * emission factors, health guidelines, tariffs, and timeouts.
 */

// WHO & CPCB Air Quality Reference Thresholds (µg/m³)
export const WHO_PM25_ANNUAL_TARGET = 5;
export const WHO_PM25_24H_TARGET = 15;
export const CPCB_PM25_24H_TARGET = 60;
export const CPCB_PM10_24H_TARGET = 100;

// Emission Factors (kg CO2-eq per unit activity)
export const EMISSION_FACTORS = {
  COAL_STOVE_PER_KG: 2.42,
  PETROL_CAR_PER_KM: 0.192,
  DIESEL_CAR_PER_KM: 0.22,
  BIOMASS_BURNING_PER_KG: 1.45,
  GRID_POWER_PER_KWH: 0.82,
  ELECTRIC_METRO_PER_PASSENGER_KM: 0.028,
  SOLAR_OFFSET_PER_KWH: 0.82
};

// Economic Tariffs, Savings, and Costs (INR)
export const TARIFFS = {
  GRID_ELECTRICITY_PER_KWH: 7.5,
  PETROL_PER_LITER: 96.72,
  DIESEL_PER_LITER: 89.62,
  DIY_CORSI_ROSENTHAL_BOX_COST: 1450,
  COMMERCIAL_HEPA_PURIFIER_COST: 12500,
  HEALTH_SAVINGS_INR_PER_G_PM25: 12.5
};

// Physiological & Infiltration Parameters
export const RESPIRATION_RATES = {
  ADULT_DAILY_M3: 15.0,
  CHILD_DAILY_M3: 10.0,
  INFANT_DAILY_M3: 4.5
};

export const INFILTRATION_FACTORS = {
  STANDARD_UNSEALED: 0.7,
  WEATHERSTRIPPED: 0.35,
  CORSI_ROSENTHAL_ATTENUATION: 0.85,
  N95_MASK_PROTECTION_RATE: 0.95,
  HEPA_RESIDUAL_FRACTION: 0.1
};

export const TARGET_AIR_CHANGES_PER_HOUR = 5;

// Atmospheric Boundary Layer & Thermal Inversion Heights (meters)
export const INVERSION_HEIGHTS = {
  NOCTURNAL_SHALLOW_METERS: 70,
  MORNING_TRANSITION_METERS: 210,
  AFTERNOON_MIXING_MAX_METERS: 1200,
  EVENING_DECAY_METERS: 480
};

// Operational Timeouts and Intervals (ms)
export const TIMEOUTS = {
  GEMINI_API_REQUEST_MS: 7500,
  GEMINI_SERVERLESS_ABORT_MS: 7000,
  TOAST_AUTO_DISMISS_MS: 4500,
  DEBOUNCE_SEARCH_MS: 300,
  TICKER_REFRESH_INTERVAL_MS: 30000,
  LIVE_API_REQUEST_MS: 6000,
  LIVE_API_CACHE_TTL_MS: 600000
};

// Free, key-less live data APIs (Open-Meteo / CAMS). No credentials required
// and none are ever sent: requests carry only rounded public coordinates.
export const LIVE_API = {
  AIR_QUALITY_BASE: 'https://air-quality-api.open-meteo.com/v1/air-quality',
  WEATHER_BASE: 'https://api.open-meteo.com/v1/forecast',
  GEOCODING_BASE: 'https://geocoding-api.open-meteo.com/v1/search',
  DEFAULT_PLACE: Object.freeze({
    name: 'Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209
  })
};

// Clean Air Delivery Rates (CADR in CFM)
export const CADR_RATINGS = {
  DIY_CORSI_ROSENTHAL_CFM: 450,
  COMMERCIAL_HEPA_ENTRY_CFM: 180,
  STANDARD_WINDOW_FAN_CFM: 300
};

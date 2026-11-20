/**
 * @file liveAirQuality.js
 * Live, free, key-less air-quality data service.
 *
 * Sources (all free, no API key, CORS-enabled, verified live):
 * - Open-Meteo Air Quality API — CAMS modelled PM2.5, PM10, CO, NO2, O3,
 *   US & European AQI (https://air-quality-api.open-meteo.com).
 * - Open-Meteo Weather API — temperature, humidity, wind and, critically,
 *   `boundary_layer_height`, the physical driver of winter smog inversions
 *   (https://api.open-meteo.com).
 * - Open-Meteo Geocoding API — city search to coordinates
 *   (https://geocoding-api.open-meteo.com).
 *
 * Design guarantees:
 * - Pure, injectable `fetchFn` so every path is unit-testable offline.
 * - Coordinates are validated and rounded before any request is built;
 *   no credentials, identifiers or user data ever leave the device.
 * - Responses are normalised, clamped and cached (10 min TTL) so the UI
 *   stays fast and the free API is never hammered.
 * - Every failure raises a typed `LiveDataError`; callers fall back to the
 *   statutory CPCB baseline already bundled with AURA. The app never
 *   hard-depends on the network.
 */

import { LIVE_API, TIMEOUTS, WHO_PM25_24H_TARGET } from '../constants';
import { sanitizeInput } from '../utils/sanitize';

export const LIVE_PROVENANCE = Object.freeze({
  id: 'LIVE_OPEN_METEO_CAMS',
  label: 'Live Open-Meteo / CAMS',
  source: 'Open-Meteo Air Quality (CAMS) + Weather APIs — free, no key',
  isSimulation: false
});

/** Typed error so callers can distinguish live-data failures from bugs. */
export class LiveDataError extends Error {
  /**
   * @param {string} message - Human-readable failure reason
   * @param {string} [code] - Machine-readable code (NETWORK, HTTP, TIMEOUT, INVALID, EMPTY)
   */
  constructor(message, code = 'NETWORK') {
    super(message);
    this.name = 'LiveDataError';
    this.code = code;
  }
}

/**
 * Validates geographic coordinates.
 * @param {unknown} latitude
 * @param {unknown} longitude
 * @returns {{ isValid: boolean, errors: string[], latitude: number|null, longitude: number|null }}
 */
export function validateCoordinates(latitude, longitude) {
  const errors = [];
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    errors.push('Latitude must be a number between -90 and 90.');
  }
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
    errors.push('Longitude must be a number between -180 and 180.');
  }
  return {
    isValid: errors.length === 0,
    errors,
    latitude: errors.length === 0 ? lat : null,
    longitude: errors.length === 0 ? lon : null
  };
}

/** Rounds coordinates to 2dp (~1.1 km) for privacy and cache sharing. */
export function roundCoordinate(value) {
  const num = Number(value);
  return Number.isFinite(num) ? Math.round(num * 100) / 100 : null;
}

/** @returns {{ latitude: number, longitude: number }} Validated coordinates */
function requireValidCoordinates(latitude, longitude) {
  const check = validateCoordinates(latitude, longitude);
  if (!check.isValid) {
    throw new LiveDataError(check.errors.join(' '), 'INVALID');
  }
  return { latitude: Number(latitude), longitude: Number(longitude) };
}

const AQ_FIELDS = 'pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,us_aqi,european_aqi';
const WX_FIELDS =
  'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,boundary_layer_height';

/**
 * Builds the Open-Meteo air-quality request URL for validated coordinates.
 * @param {{ latitude: number, longitude: number }} coords
 * @returns {string} Absolute URL (no credentials, rounded coordinates only)
 */
export function buildAirQualityUrl({ latitude, longitude }) {
  const { latitude: lat, longitude: lon } = requireValidCoordinates(latitude, longitude);
  const params = new URLSearchParams({
    latitude: String(roundCoordinate(lat)),
    longitude: String(roundCoordinate(lon)),
    hourly: AQ_FIELDS,
    forecast_days: '2',
    timezone: 'auto'
  });
  return `${LIVE_API.AIR_QUALITY_BASE}?${params.toString()}`;
}

/**
 * Builds the Open-Meteo weather request URL (includes boundary-layer height).
 * @param {{ latitude: number, longitude: number }} coords
 * @returns {string} Absolute URL
 */
export function buildWeatherUrl({ latitude, longitude }) {
  const { latitude: lat, longitude: lon } = requireValidCoordinates(latitude, longitude);
  const params = new URLSearchParams({
    latitude: String(roundCoordinate(lat)),
    longitude: String(roundCoordinate(lon)),
    hourly: WX_FIELDS,
    forecast_days: '2',
    timezone: 'auto'
  });
  return `${LIVE_API.WEATHER_BASE}?${params.toString()}`;
}

/**
 * Builds a geocoding search URL. The query is sanitised and URI-encoded,
 * so user text can never break out of the `name` parameter.
 * @param {string} query - City name typed by the user
 * @returns {string|null} Absolute URL, or null for an unusable query
 */
export function buildGeocodingUrl(query) {
  const clean = sanitizeInput(typeof query === 'string' ? query : '', 60);
  if (clean.length < 2) return null;
  const params = new URLSearchParams({
    name: clean,
    count: '5',
    language: 'en',
    format: 'json'
  });
  return `${LIVE_API.GEOCODING_BASE}?${params.toString()}`;
}

const US_AQI_BANDS = Object.freeze([
  {
    max: 50,
    id: 'good',
    label: 'Good',
    color: '#34d399',
    guidance: 'Air is clean. Enjoy outdoor activity.'
  },
  {
    max: 100,
    id: 'moderate',
    label: 'Moderate',
    color: '#fbbf24',
    guidance: 'Sensitive people should watch symptoms.'
  },
  {
    max: 150,
    id: 'usg',
    label: 'Unhealthy for sensitive groups',
    color: '#fb923c',
    guidance: 'Children, seniors and asthmatics: shorten outdoor exertion.'
  },
  {
    max: 200,
    id: 'unhealthy',
    label: 'Unhealthy',
    color: '#f87171',
    guidance: 'Everyone should reduce prolonged outdoor exertion; wear a fitted N95 outside.'
  },
  {
    max: 300,
    id: 'very_unhealthy',
    label: 'Very unhealthy',
    color: '#c084fc',
    guidance: 'Avoid outdoor exertion. Seal windows and run filtration indoors.'
  },
  {
    max: Infinity,
    id: 'hazardous',
    label: 'Hazardous',
    color: '#f43f5e',
    guidance: 'Stay indoors with filtration. Outdoor activity only if essential, with an N95.'
  }
]);

/**
 * Maps a US AQI value to its EPA category, colour and family guidance.
 * @param {unknown} aqi
 * @returns {{ id: string, label: string, color: string, guidance: string }|null}
 */
export function usAqiCategory(aqi) {
  if (aqi === null || aqi === undefined || aqi === '' || typeof aqi === 'boolean') return null;
  const value = Number(aqi);
  if (!Number.isFinite(value) || value < 0) return null;
  return US_AQI_BANDS.find((band) => value <= band.max) || null;
}

/** Clamps a raw measurement to a sane, finite, non-negative number or null. */
export function clampMeasurement(value, max = 2000) {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
    return null;
  }
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return null;
  return Math.round(Math.min(num, max) * 10) / 10;
}

function hourlyValue(hourly, field, index) {
  const series = hourly?.[field];
  if (!Array.isArray(series) || index < 0 || index >= series.length) return null;
  return series[index];
}

/**
 * Finds the hourly index closest to `now` (never a future hour when a past
 * hour exists), so "current" always means the latest measured hour.
 * @param {string[]} times - ISO timestamps from the API
 * @param {Date} [now]
 * @returns {number} Index, or -1 when there are no timestamps
 */
export function pickCurrentIndex(times, now = new Date()) {
  if (!Array.isArray(times) || times.length === 0) return -1;
  const target = now.getTime();
  let best = 0;
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();
    if (Number.isFinite(t) && t <= target) best = i;
  }
  return best;
}

/**
 * Reads one clamped measurement from an hourly payload.
 * @param {any} hourly - Hourly series object
 * @param {string} field - Series name
 * @param {number} index - Hour index
 * @param {number} [max] - Clamp ceiling
 * @returns {number|null}
 */
function measurement(hourly, field, index, max) {
  return clampMeasurement(hourlyValue(hourly, field, index), max);
}

function textOr(value, fallback) {
  return typeof value === 'string' && value ? value : fallback;
}

function roundOrNull(value) {
  return value === null ? null : Math.round(value);
}

function ugToMg(value) {
  return value === null ? null : Math.round((value / 1000) * 100) / 100;
}

const EMPTY_WEATHER = Object.freeze({
  temperatureC: null,
  humidityPct: null,
  windSpeedKmh: null,
  boundaryLayerHeightM: null,
  hourlyBoundaryLayer: []
});

function weatherFields(wxPayload, now) {
  const wx = wxPayload?.hourly;
  if (!wx || !Array.isArray(wx.time)) return EMPTY_WEATHER;
  const index = pickCurrentIndex(wx.time, now);
  if (index < 0) return EMPTY_WEATHER;
  return {
    temperatureC: measurement(wx, 'temperature_2m', index, 80),
    humidityPct: measurement(wx, 'relative_humidity_2m', index, 100),
    windSpeedKmh: measurement(wx, 'wind_speed_10m', index, 400),
    boundaryLayerHeightM: measurement(wx, 'boundary_layer_height', index, 5000),
    hourlyBoundaryLayer: Array.isArray(wx.boundary_layer_height) ? wx.boundary_layer_height : []
  };
}

/**
 * Normalises raw Open-Meteo payloads into one typed snapshot.
 * @param {any} aqPayload - Air-quality API JSON
 * @param {any} wxPayload - Weather API JSON (optional)
 * @param {{ name?: string, country?: string }} [place]
 * @param {Date} [now]
 * @returns {object} Snapshot with provenance, measurements and category
 */
export function normalizeSnapshot(aqPayload, wxPayload, place = {}, now = new Date()) {
  const hourly = aqPayload?.hourly;
  if (!hourly || !Array.isArray(hourly.time) || hourly.time.length === 0) {
    throw new LiveDataError('Air-quality response contained no hourly data.', 'EMPTY');
  }
  const index = pickCurrentIndex(hourly.time, now);
  const usAqiRaw = measurement(hourly, 'us_aqi', index, 1000);
  const coRaw = measurement(hourly, 'carbon_monoxide', index, 100000);
  return {
    provenance: LIVE_PROVENANCE.id,
    sourceLabel: LIVE_PROVENANCE.label,
    placeName: textOr(sanitizeInput(place.name || '', 80), 'Selected location'),
    country: sanitizeInput(place.country || '', 80),
    latitude: roundCoordinate(aqPayload.latitude),
    longitude: roundCoordinate(aqPayload.longitude),
    timezone: textOr(aqPayload.timezone, 'UTC'),
    observedAt: hourly.time[index],
    usAqi: roundOrNull(usAqiRaw),
    europeanAqi: measurement(hourly, 'european_aqi', index, 1000),
    category: usAqiCategory(usAqiRaw),
    pm25: measurement(hourly, 'pm2_5', index),
    pm10: measurement(hourly, 'pm10', index),
    no2: measurement(hourly, 'nitrogen_dioxide', index),
    o3: measurement(hourly, 'ozone', index),
    coMgM3: ugToMg(coRaw),
    ...weatherFields(wxPayload, now),
    hourlyPm25: Array.isArray(hourly.pm2_5) ? hourly.pm2_5 : [],
    hourlyTimes: hourly.time
  };
}

/**
 * Derives the ventilation decision from physics, not vibes: a high boundary
 * layer disperses pollution; a shallow one traps it at breathing height.
 * @param {any} snapshot - Normalised snapshot from normalizeSnapshot
 * @returns {{ level: 'golden'|'caution'|'sealed', headline: string, detail: string }}
 */
export function deriveVentilationAdvice(snapshot) {
  const pm25 = snapshot?.pm25;
  const blh = snapshot?.boundaryLayerHeightM;
  if (pm25 === null || pm25 === undefined) {
    return {
      level: 'caution',
      headline: 'Ventilation unknown — keep windows mostly closed',
      detail:
        'Live PM2.5 is unavailable for this location, so AURA cannot certify a safe ventilation window.'
    };
  }
  if (pm25 <= WHO_PM25_24H_TARGET * 4 && (blh === null || blh >= 400)) {
    return {
      level: 'golden',
      headline: 'Golden window — ventilate now',
      detail: `PM2.5 is ${pm25} µg/m³ and the mixing layer is ${blh === null ? 'dispersive' : `${Math.round(blh)} m high`}. Cross-ventilate for 30–45 minutes to flush indoor CO₂ and cooking particles.`
    };
  }
  if (pm25 <= 100) {
    return {
      level: 'caution',
      headline: 'Brief ventilation only',
      detail: `PM2.5 is ${pm25} µg/m³. Open windows for 10 minutes maximum, then reseal and run filtration.`
    };
  }
  return {
    level: 'sealed',
    headline: 'Stay sealed — smog trap active',
    detail: `PM2.5 is ${pm25} µg/m³${blh !== null && blh !== undefined ? ` under a shallow ${Math.round(blh)} m inversion layer` : ''}. Keep windows shut, weatherstrip gaps and run a purifier or DIY Corsi-Rosenthal box.`
  };
}

/**
 * Explains the direct health impact of the live air in plain numbers:
 * unprotected inhaled dose vs. the dose with sealing + filtration.
 * Dose (µg) = PM2.5 (µg/m³) × breathing volume (15 m³/day adult).
 * @param {any} snapshot
 * @returns {{ unprotectedUg: number, protectedUg: number, avoidedUg: number, whoMultiple: number }|null}
 */
export function explainImpact(snapshot) {
  const pm25 = snapshot?.pm25;
  if (pm25 === null || pm25 === undefined || !Number.isFinite(Number(pm25))) return null;
  const unprotectedUg = Math.round(Number(pm25) * 15);
  const protectedUg = Math.round(unprotectedUg * 0.08);
  return {
    unprotectedUg,
    protectedUg,
    avoidedUg: unprotectedUg - protectedUg,
    whoMultiple: Math.round((Number(pm25) / WHO_PM25_24H_TARGET) * 10) / 10
  };
}

/**
 * Normalises geocoding results into safe, display-ready place options.
 * @param {any} payload - Geocoding API JSON
 * @returns {Array<{ name: string, country: string, admin1: string, latitude: number, longitude: number }>}
 */
export function parseGeocodingResults(payload) {
  if (!payload || !Array.isArray(payload.results)) return [];
  return payload.results
    .filter((r) => validateCoordinates(r?.latitude, r?.longitude).isValid)
    .slice(0, 5)
    .map((r) => ({
      name: sanitizeInput(r.name || '', 80),
      country: sanitizeInput(r.country || '', 80),
      admin1: sanitizeInput(r.admin1 || '', 80),
      latitude: roundCoordinate(r.latitude),
      longitude: roundCoordinate(r.longitude)
    }));
}

async function fetchJson(url, fetchFn, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchFn(url, { signal: controller.signal });
    if (!response || !response.ok) {
      throw new LiveDataError(
        `Live data request failed (HTTP ${response?.status ?? 'unknown'}).`,
        'HTTP'
      );
    }
    return await response.json();
  } catch (err) {
    if (err instanceof LiveDataError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new LiveDataError('Live data request timed out.', 'TIMEOUT');
    }
    throw new LiveDataError('Live data request could not reach the free API.', 'NETWORK');
  } finally {
    clearTimeout(timer);
  }
}

const snapshotCache = new Map();

/** Clears the in-memory snapshot cache (used by tests and manual refresh). */
export function clearLiveCache() {
  snapshotCache.clear();
}

function cacheKey(latitude, longitude) {
  return `${roundCoordinate(latitude)},${roundCoordinate(longitude)}`;
}

/**
 * Searches free geocoding for a city name.
 * @param {string} query
 * @param {{ fetchFn?: Function, timeoutMs?: number }} [options]
 * @returns {Promise<Array>} Place options (empty for an unusable query)
 */
export async function searchCities(query, options = {}) {
  const url = buildGeocodingUrl(query);
  if (!url) return [];
  const fetchFn = options.fetchFn || fetch;
  const payload = await fetchJson(url, fetchFn, options.timeoutMs || TIMEOUTS.LIVE_API_REQUEST_MS);
  return parseGeocodingResults(payload);
}

/**
 * Fetches and normalises a live snapshot, using the 10-minute cache.
 * Weather failure is non-fatal: the snapshot is returned without meteo
 * fields rather than failing the whole live view.
 * @param {{ latitude: number, longitude: number, name?: string, country?: string }} place
 * @param {{ fetchFn?: Function, timeoutMs?: number, force?: boolean, now?: Date }} [options]
 * @returns {Promise<object>} Normalised live snapshot
 */
export async function fetchLiveSnapshot(place, options = {}) {
  const { latitude, longitude } = requireValidCoordinates(place?.latitude, place?.longitude);
  const key = cacheKey(latitude, longitude);
  const cached = snapshotCache.get(key);
  const nowMs = (options.now || new Date()).getTime();
  if (!options.force && cached && nowMs - cached.storedAt < TIMEOUTS.LIVE_API_CACHE_TTL_MS) {
    return cached.snapshot;
  }
  const fetchFn = options.fetchFn || fetch;
  const timeoutMs = options.timeoutMs || TIMEOUTS.LIVE_API_REQUEST_MS;
  const aqPayload = await fetchJson(
    buildAirQualityUrl({ latitude, longitude }),
    fetchFn,
    timeoutMs
  );
  let wxPayload = null;
  try {
    wxPayload = await fetchJson(buildWeatherUrl({ latitude, longitude }), fetchFn, timeoutMs);
  } catch {
    wxPayload = null; // Meteo is enrichment, never a single point of failure.
  }
  const snapshot = normalizeSnapshot(aqPayload, wxPayload, place, options.now || new Date());
  snapshotCache.set(key, { snapshot, storedAt: nowMs });
  return snapshot;
}

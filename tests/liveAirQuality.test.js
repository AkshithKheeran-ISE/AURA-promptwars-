import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  LiveDataError,
  LIVE_PROVENANCE,
  validateCoordinates,
  roundCoordinate,
  buildAirQualityUrl,
  buildWeatherUrl,
  buildGeocodingUrl,
  usAqiCategory,
  clampMeasurement,
  pickCurrentIndex,
  normalizeSnapshot,
  deriveVentilationAdvice,
  explainImpact,
  parseGeocodingResults,
  searchCities,
  fetchLiveSnapshot,
  clearLiveCache
} from '../src/services/liveAirQuality';

const NOW = new Date('2026-01-15T10:30:00'); // naive local, matching API wall-clock times

function aqPayload(overrides = {}) {
  return {
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
    hourly: {
      time: ['2026-01-15T09:00', '2026-01-15T10:00', '2026-01-15T11:00'],
      pm2_5: [180, 210, 240],
      pm10: [300, 340, 380],
      carbon_monoxide: [1200, 1500, 1800],
      nitrogen_dioxide: [60, 72, 80],
      ozone: [20, 25, 30],
      us_aqi: [160, 185, 205],
      european_aqi: [90, 98, 110],
      ...overrides
    }
  };
}

function wxPayload() {
  return {
    hourly: {
      time: ['2026-01-15T09:00', '2026-01-15T10:00', '2026-01-15T11:00'],
      temperature_2m: [9, 11, 13],
      relative_humidity_2m: [80, 72, 65],
      wind_speed_10m: [4, 6, 8],
      wind_direction_10m: [300, 310, 320],
      boundary_layer_height: [90, 140, 320]
    }
  };
}

function okJson(payload) {
  return { ok: true, status: 200, json: async () => payload };
}

describe('liveAirQuality service (free Open-Meteo APIs)', () => {
  beforeEach(() => clearLiveCache());

  describe('validateCoordinates', () => {
    it.each([
      [28.61, 77.2, true],
      [90, 180, true],
      [-90, -180, true],
      [0, 0, true],
      ['28.61', '77.2', true]
    ])('accepts %s, %s', (lat, lon, expected) => {
      expect(validateCoordinates(lat, lon).isValid).toBe(expected);
    });

    it.each([
      [91, 0],
      [-91, 0],
      [0, 181],
      [0, -181],
      [NaN, 0],
      [Infinity, 0],
      [null, undefined],
      ['north', 'east']
    ])('rejects %s, %s', (lat, lon) => {
      const result = validateCoordinates(lat, lon);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.latitude).toBeNull();
    });
  });

  describe('roundCoordinate', () => {
    it('rounds to 2 decimal places for privacy', () => {
      expect(roundCoordinate(28.61394)).toBe(28.61);
      expect(roundCoordinate(77.20902)).toBe(77.21);
    });
    it('returns null for non-finite input', () => {
      expect(roundCoordinate('x')).toBeNull();
      expect(roundCoordinate(NaN)).toBeNull();
    });
  });

  describe('URL builders', () => {
    it('builds an air-quality URL with rounded coords and no credentials', () => {
      const url = buildAirQualityUrl({ latitude: 28.6139, longitude: 77.209 });
      expect(url).toContain('https://air-quality-api.open-meteo.com/v1/air-quality?');
      expect(url).toContain('latitude=28.61');
      expect(url).toContain('longitude=77.21');
      expect(url).toContain('pm2_5');
      expect(url).toContain('us_aqi');
      expect(url.toLowerCase()).not.toContain('key');
      expect(url.toLowerCase()).not.toContain('token');
    });

    it('builds a weather URL including boundary_layer_height', () => {
      const url = buildWeatherUrl({ latitude: 28.61, longitude: 77.21 });
      expect(url).toContain('https://api.open-meteo.com/v1/forecast?');
      expect(url).toContain('boundary_layer_height');
    });

    it('throws a typed error for invalid coordinates', () => {
      expect(() => buildAirQualityUrl({ latitude: 999, longitude: 0 })).toThrow(LiveDataError);
      expect(() => buildWeatherUrl({ latitude: 0, longitude: -999 })).toThrow(/Longitude/);
    });

    it('encodes geocoding queries safely', () => {
      const url = buildGeocodingUrl('New Delhi & <script>');
      expect(url).toContain('https://geocoding-api.open-meteo.com/v1/search?');
      expect(url).not.toContain('<script>');
      expect(url).toContain('name=');
    });

    it.each(['', 'a', '   ', null, undefined, 42])(
      'returns null geocoding URL for unusable query %s',
      (query) => {
        expect(buildGeocodingUrl(query)).toBeNull();
      }
    );
  });

  describe('usAqiCategory', () => {
    it.each([
      [0, 'good'],
      [50, 'good'],
      [51, 'moderate'],
      [100, 'moderate'],
      [101, 'usg'],
      [150, 'usg'],
      [151, 'unhealthy'],
      [200, 'unhealthy'],
      [201, 'very_unhealthy'],
      [300, 'very_unhealthy'],
      [301, 'hazardous'],
      [500, 'hazardous']
    ])('maps AQI %i to %s', (aqi, id) => {
      const category = usAqiCategory(aqi);
      expect(category.id).toBe(id);
      expect(category.label.length).toBeGreaterThan(0);
      expect(category.guidance.length).toBeGreaterThan(0);
      expect(category.color).toMatch(/^#/);
    });

    it.each([null, undefined, NaN, -5, 'high'])('returns null for %s', (aqi) => {
      expect(usAqiCategory(aqi)).toBeNull();
    });
  });

  describe('clampMeasurement', () => {
    it('rounds valid values and clamps to max', () => {
      expect(clampMeasurement(12.34)).toBe(12.3);
      expect(clampMeasurement(99999, 100)).toBe(100);
      expect(clampMeasurement(0)).toBe(0);
    });
    it.each([null, undefined, NaN, Infinity, -1, 'x'])('returns null for %s', (value) => {
      expect(clampMeasurement(value)).toBeNull();
    });
  });

  describe('pickCurrentIndex', () => {
    const times = ['2026-01-15T09:00', '2026-01-15T10:00', '2026-01-15T11:00'];
    it('picks the latest hour at or before now', () => {
      expect(pickCurrentIndex(times, NOW)).toBe(1);
    });
    it('falls back to the first hour when now precedes all data', () => {
      expect(pickCurrentIndex(times, new Date('2026-01-15T08:00:00'))).toBe(0);
    });
    it('returns -1 for empty or invalid input', () => {
      expect(pickCurrentIndex([], NOW)).toBe(-1);
      expect(pickCurrentIndex(null, NOW)).toBe(-1);
    });
  });

  describe('normalizeSnapshot', () => {
    it('merges air-quality and weather payloads into a typed snapshot', () => {
      const snap = normalizeSnapshot(
        aqPayload(),
        wxPayload(),
        { name: 'Delhi', country: 'India' },
        NOW
      );
      expect(snap.pm25).toBe(210);
      expect(snap.pm10).toBe(340);
      expect(snap.no2).toBe(72);
      expect(snap.o3).toBe(25);
      expect(snap.coMgM3).toBe(1.5);
      expect(snap.usAqi).toBe(185);
      expect(snap.category.id).toBe('unhealthy');
      expect(snap.temperatureC).toBe(11);
      expect(snap.humidityPct).toBe(72);
      expect(snap.windSpeedKmh).toBe(6);
      expect(snap.boundaryLayerHeightM).toBe(140);
      expect(snap.provenance).toBe(LIVE_PROVENANCE.id);
      expect(snap.placeName).toBe('Delhi');
      expect(snap.observedAt).toBe('2026-01-15T10:00');
    });

    it('works without weather data (meteo fields are null, never invented)', () => {
      const snap = normalizeSnapshot(aqPayload(), null, {}, NOW);
      expect(snap.temperatureC).toBeNull();
      expect(snap.boundaryLayerHeightM).toBeNull();
      expect(snap.pm25).toBe(210);
      expect(snap.placeName).toBe('Selected location');
    });

    it('throws a typed EMPTY error when hourly data is missing', () => {
      expect(() => normalizeSnapshot({}, null, {}, NOW)).toThrow(LiveDataError);
      expect(() => normalizeSnapshot({ hourly: { time: [] } }, null, {}, NOW)).toThrow(/no hourly/);
    });

    it('nulls missing pollutant series instead of fabricating values', () => {
      const snap = normalizeSnapshot(aqPayload({ pm2_5: [null, null, null] }), null, {}, NOW);
      expect(snap.pm25).toBeNull();
    });
  });

  describe('deriveVentilationAdvice', () => {
    it('certifies a golden window when air is cleaner and layer is dispersive', () => {
      expect(deriveVentilationAdvice({ pm25: 40, boundaryLayerHeightM: 600 }).level).toBe('golden');
      expect(deriveVentilationAdvice({ pm25: 40, boundaryLayerHeightM: null }).level).toBe(
        'golden'
      );
    });
    it('advises brief ventilation at moderate PM2.5', () => {
      expect(deriveVentilationAdvice({ pm25: 80, boundaryLayerHeightM: 200 }).level).toBe(
        'caution'
      );
    });
    it('advises staying sealed in a smog trap', () => {
      const advice = deriveVentilationAdvice({ pm25: 210, boundaryLayerHeightM: 140 });
      expect(advice.level).toBe('sealed');
      expect(advice.detail).toContain('140 m');
    });
    it('is honest when PM2.5 is unknown', () => {
      expect(deriveVentilationAdvice({ pm25: null }).level).toBe('caution');
      expect(deriveVentilationAdvice(null).level).toBe('caution');
    });
  });

  describe('explainImpact', () => {
    it('quantifies unprotected vs protected inhaled dose', () => {
      const impact = explainImpact({ pm25: 200 });
      expect(impact.unprotectedUg).toBe(3000);
      expect(impact.protectedUg).toBe(240);
      expect(impact.avoidedUg).toBe(2760);
      expect(impact.whoMultiple).toBe(13.3);
    });
    it('returns null without a PM2.5 value', () => {
      expect(explainImpact({ pm25: null })).toBeNull();
      expect(explainImpact(null)).toBeNull();
    });
  });

  describe('parseGeocodingResults', () => {
    it('normalises and filters invalid places', () => {
      const results = parseGeocodingResults({
        results: [
          { name: 'Delhi', country: 'India', admin1: 'NCT', latitude: 28.65, longitude: 77.23 },
          { name: 'Broken', latitude: 999, longitude: 0 }
        ]
      });
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({ name: 'Delhi', latitude: 28.65, longitude: 77.23 });
    });
    it('returns an empty list for malformed payloads', () => {
      expect(parseGeocodingResults(null)).toEqual([]);
      expect(parseGeocodingResults({})).toEqual([]);
    });
  });

  describe('searchCities', () => {
    it('returns parsed places via the injected fetch', async () => {
      const fetchFn = vi.fn(async () =>
        okJson({
          results: [{ name: 'Mumbai', country: 'India', latitude: 19.07, longitude: 72.87 }]
        })
      );
      const results = await searchCities('Mumbai', { fetchFn });
      expect(results).toHaveLength(1);
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });
    it('skips the network for an unusable query', async () => {
      const fetchFn = vi.fn();
      await expect(searchCities('x', { fetchFn })).resolves.toEqual([]);
      expect(fetchFn).not.toHaveBeenCalled();
    });
    it('maps HTTP failures to a typed error', async () => {
      const fetchFn = vi.fn(async () => ({ ok: false, status: 503, json: async () => ({}) }));
      await expect(searchCities('Delhi', { fetchFn })).rejects.toMatchObject({ code: 'HTTP' });
    });
    it('maps network failures to a typed error', async () => {
      const fetchFn = vi.fn(async () => {
        throw new TypeError('offline');
      });
      await expect(searchCities('Delhi', { fetchFn })).rejects.toMatchObject({ code: 'NETWORK' });
    });
    it('maps aborts to a TIMEOUT error', async () => {
      const fetchFn = vi.fn(async () => {
        const err = new Error('aborted');
        err.name = 'AbortError';
        throw err;
      });
      await expect(searchCities('Delhi', { fetchFn })).rejects.toMatchObject({ code: 'TIMEOUT' });
    });
  });

  describe('fetchLiveSnapshot', () => {
    const place = { latitude: 28.6139, longitude: 77.209, name: 'Delhi', country: 'India' };

    it('fetches AQ + weather and returns a normalised snapshot', async () => {
      const fetchFn = vi.fn(async (url) =>
        url.includes('air-quality') ? okJson(aqPayload()) : okJson(wxPayload())
      );
      const snap = await fetchLiveSnapshot(place, { fetchFn, now: NOW });
      expect(snap.pm25).toBe(210);
      expect(snap.boundaryLayerHeightM).toBe(140);
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('serves the second call from cache without new requests', async () => {
      const fetchFn = vi.fn(async (url) =>
        url.includes('air-quality') ? okJson(aqPayload()) : okJson(wxPayload())
      );
      await fetchLiveSnapshot(place, { fetchFn, now: NOW });
      const again = await fetchLiveSnapshot(place, {
        fetchFn,
        now: new Date(NOW.getTime() + 60000)
      });
      expect(again.pm25).toBe(210);
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('refetches when forced or when the cache has expired', async () => {
      const fetchFn = vi.fn(async (url) =>
        url.includes('air-quality') ? okJson(aqPayload()) : okJson(wxPayload())
      );
      await fetchLiveSnapshot(place, { fetchFn, now: NOW });
      await fetchLiveSnapshot(place, { fetchFn, now: NOW, force: true });
      expect(fetchFn).toHaveBeenCalledTimes(4);
      await fetchLiveSnapshot(place, {
        fetchFn,
        now: new Date(NOW.getTime() + 11 * 60 * 1000)
      });
      expect(fetchFn).toHaveBeenCalledTimes(6);
    });

    it('still returns AQ data when the weather API fails', async () => {
      const fetchFn = vi.fn(async (url) => {
        if (url.includes('air-quality')) return okJson(aqPayload());
        throw new TypeError('weather offline');
      });
      const snap = await fetchLiveSnapshot(place, { fetchFn, now: NOW });
      expect(snap.pm25).toBe(210);
      expect(snap.boundaryLayerHeightM).toBeNull();
    });

    it('rejects invalid coordinates before any request', async () => {
      const fetchFn = vi.fn();
      await expect(
        fetchLiveSnapshot({ latitude: 999, longitude: 0 }, { fetchFn })
      ).rejects.toMatchObject({ code: 'INVALID' });
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('propagates AQ API failure as a typed error', async () => {
      const fetchFn = vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }));
      await expect(fetchLiveSnapshot(place, { fetchFn, now: NOW })).rejects.toBeInstanceOf(
        LiveDataError
      );
    });
  });
});

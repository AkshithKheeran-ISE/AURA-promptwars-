import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLiveAirQuality } from '../../src/hooks/useLiveAirQuality';
import { clearLiveCache } from '../../src/services/liveAirQuality';

function aqPayload() {
  const hour = new Date().toISOString().slice(0, 13) + ':00';
  return {
    latitude: 28.61,
    longitude: 77.21,
    timezone: 'Asia/Kolkata',
    hourly: {
      time: [hour],
      pm2_5: [120],
      pm10: [200],
      carbon_monoxide: [900],
      nitrogen_dioxide: [40],
      ozone: [18],
      us_aqi: [130],
      european_aqi: [70]
    }
  };
}

function wxPayload() {
  const hour = new Date().toISOString().slice(0, 13) + ':00';
  return {
    hourly: {
      time: [hour],
      temperature_2m: [12],
      relative_humidity_2m: [70],
      wind_speed_10m: [5],
      wind_direction_10m: [300],
      boundary_layer_height: [180]
    }
  };
}

function okJson(payload) {
  return { ok: true, status: 200, json: async () => payload };
}

function liveFetch() {
  return vi.fn(async (url) => {
    if (url.includes('geocoding')) {
      return okJson({
        results: [
          {
            name: 'Mumbai',
            country: 'India',
            admin1: 'Maharashtra',
            latitude: 19.07,
            longitude: 72.87
          }
        ]
      });
    }
    return url.includes('air-quality') ? okJson(aqPayload()) : okJson(wxPayload());
  });
}

describe('useLiveAirQuality hook', () => {
  beforeEach(() => clearLiveCache());

  it('loads the default city on mount and reaches live status', async () => {
    const { result } = renderHook(() => useLiveAirQuality({ fetchFn: liveFetch() }));
    await waitFor(() => expect(result.current.status).toBe('live'));
    expect(result.current.snapshot.pm25).toBe(120);
    expect(result.current.place.name).toBe('Delhi');
    expect(result.current.error).toBeNull();
  });

  it('reports an honest error state when the free API is unreachable', async () => {
    const fetchFn = vi.fn(async () => {
      throw new TypeError('offline');
    });
    const { result } = renderHook(() => useLiveAirQuality({ fetchFn }));
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.snapshot).toBeNull();
    expect(result.current.error).toMatch(/reach the free API/i);
  });

  it('rejects invalid coordinates without a network call', async () => {
    const fetchFn = liveFetch();
    const { result } = renderHook(() => useLiveAirQuality({ fetchFn }));
    await waitFor(() => expect(result.current.status).toBe('live'));
    const callsBefore = fetchFn.mock.calls.length;
    await act(async () => {
      await result.current.loadFor({ latitude: 999, longitude: 0 });
    });
    expect(result.current.status).toBe('error');
    expect(fetchFn.mock.calls.length).toBe(callsBefore);
  });

  it('searches cities and loads a selected place', async () => {
    const fetchFn = liveFetch();
    const { result } = renderHook(() => useLiveAirQuality({ fetchFn }));
    await waitFor(() => expect(result.current.status).toBe('live'));

    await act(async () => {
      await result.current.search('Mumbai');
    });
    expect(result.current.searchResults).toHaveLength(1);
    expect(result.current.searchResults[0].name).toBe('Mumbai');

    await act(async () => {
      await result.current.selectPlace(result.current.searchResults[0]);
    });
    expect(result.current.place.name).toBe('Mumbai');
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.status).toBe('live');
  });

  it('returns an empty result set when search fails', async () => {
    const fetchFn = vi.fn(async (url) => {
      if (url.includes('geocoding')) throw new TypeError('offline');
      return url.includes('air-quality') ? okJson(aqPayload()) : okJson(wxPayload());
    });
    const { result } = renderHook(() => useLiveAirQuality({ fetchFn }));
    await waitFor(() => expect(result.current.status).toBe('live'));
    await act(async () => {
      await result.current.search('Delhi');
    });
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searching).toBe(false);
  });

  it('ignores an error from a superseded request instead of showing it', async () => {
    let rejectFirst;
    const firstGate = new Promise((_, reject) => {
      rejectFirst = () => reject(new TypeError('first offline'));
    });
    let callCount = 0;
    const fetchFn = vi.fn(async (url) => {
      callCount += 1;
      // Only the mount load's AQ request hangs until released. The
      // weather request runs after it, so gating calls 1-2 would hang
      // the superseding load too.
      if (callCount === 1) await firstGate;
      return url.includes('air-quality') ? okJson(aqPayload()) : okJson(wxPayload());
    });
    const { result } = renderHook(() => useLiveAirQuality({ fetchFn }));
    const place = { latitude: 19.07, longitude: 72.87, name: 'Mumbai', country: 'India' };

    // A second load supersedes the hung mount load, then the hung one fails.
    await act(async () => {
      await result.current.loadFor(place);
    });
    await waitFor(() => expect(result.current.status).toBe('live'));
    expect(result.current.place.name).toBe('Mumbai');

    await act(async () => {
      rejectFirst();
      await Promise.resolve();
    });
    // The stale failure must not overwrite the live snapshot.
    expect(result.current.status).toBe('live');
    expect(result.current.error).toBeNull();
    expect(result.current.place.name).toBe('Mumbai');
  });

  it('refresh forces a fresh load for the current place', async () => {
    const fetchFn = liveFetch();
    const { result } = renderHook(() => useLiveAirQuality({ fetchFn }));
    await waitFor(() => expect(result.current.status).toBe('live'));
    const callsBefore = fetchFn.mock.calls.length;
    await act(async () => {
      await result.current.refresh();
    });
    expect(fetchFn.mock.calls.length).toBeGreaterThan(callsBefore);
    expect(result.current.status).toBe('live');
  });
});

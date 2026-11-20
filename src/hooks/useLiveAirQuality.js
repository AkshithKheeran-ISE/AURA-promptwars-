import { useCallback, useEffect, useRef, useState } from 'react';
import { LIVE_API } from '../constants';
import { fetchLiveSnapshot, searchCities, validateCoordinates } from '../services/liveAirQuality';

const INITIAL_STATE = {
  status: 'idle',
  snapshot: null,
  error: null,
  place: LIVE_API.DEFAULT_PLACE,
  searchResults: [],
  searching: false
};

/**
 * Live air-quality state: idle -> loading -> live | error. On error the
 * panel keeps the statutory baseline and says so — a failed free API must
 * never look like live data. Superseded requests are ignored by request id.
 * @param {{ fetchFn?: Function }} [options] - Injectable fetch for tests
 * @returns {object} Live state and actions
 */
export function useLiveAirQuality(options = {}) {
  const fetchFn = options.fetchFn;
  const [state, setState] = useState(INITIAL_STATE);
  const requestIdRef = useRef(0);
  const patch = useCallback((partial) => setState((prev) => ({ ...prev, ...partial })), []);

  const loadFor = useCallback(
    async (targetPlace, loadOptions = {}) => {
      const check = validateCoordinates(targetPlace?.latitude, targetPlace?.longitude);
      if (!check.isValid) {
        patch({ status: 'error', error: check.errors.join(' ') });
        return null;
      }
      const requestId = ++requestIdRef.current;
      patch({ status: 'loading', error: null });
      try {
        const place = { ...targetPlace, latitude: check.latitude, longitude: check.longitude };
        const result = await fetchLiveSnapshot(place, { fetchFn, force: loadOptions.force });
        if (requestIdRef.current !== requestId) return null; // superseded
        patch({ snapshot: result, place: targetPlace, status: 'live' });
        return result;
      } catch (err) {
        if (requestIdRef.current !== requestId) return null;
        patch({
          status: 'error',
          error: err instanceof Error ? err.message : 'Live data is unavailable right now.'
        });
        return null;
      }
    },
    [fetchFn, patch]
  );

  const search = useCallback(
    async (query) => {
      patch({ searching: true });
      try {
        const results = await searchCities(query, { fetchFn });
        patch({ searchResults: results, searching: false });
        return results;
      } catch {
        patch({ searchResults: [], searching: false });
        return [];
      }
    },
    [fetchFn, patch]
  );

  const selectPlace = useCallback(
    (nextPlace) => {
      patch({ searchResults: [] });
      return loadFor(nextPlace);
    },
    [loadFor, patch]
  );

  const refresh = useCallback(() => loadFor(state.place, { force: true }), [loadFor, state.place]);

  useEffect(() => {
    loadFor(LIVE_API.DEFAULT_PLACE);
    return () => {
      requestIdRef.current += 1; // invalidate in-flight work on unmount
    };
    // Load the default city exactly once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, loadFor, search, selectPlace, refresh };
}

export default useLiveAirQuality;

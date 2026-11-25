import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import L from 'leaflet';
import { useThreatMapLeaflet } from '../../src/hooks/useThreatMapLeaflet';

const mockMapOn = vi.fn();
const mockMapOff = vi.fn();
const mockMapLocate = vi.fn();
const mockMapGetZoom = vi.fn(() => 5);
const mockGeoJsonAddTo = vi.fn();
const mockCircleMarkerBindPopup = vi.fn();
const mockCircleMarkerAddTo = vi.fn();

// The geoJSON mock behaves like real Leaflet for the label logic: it calls
// onEachFeature once per feature with a layer whose getBounds() is computed
// from the feature's real coordinates.
vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      remove: vi.fn(),
      flyTo: vi.fn(),
      setView: vi.fn(),
      on: mockMapOn,
      off: mockMapOff,
      locate: mockMapLocate,
      getZoom: mockMapGetZoom
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis()
    })),
    divIcon: vi.fn(() => ({})),
    marker: vi.fn(() => ({
      bindPopup: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      getElement: vi.fn(() => document.createElement('div'))
    })),
    geoJSON: vi.fn((data, options) => {
      const features = data && data.features ? data.features : [];
      features.forEach((feature) => {
        const positions = [];
        const collect = (coords) => {
          if (typeof coords[0] === 'number') positions.push(coords);
          else coords.forEach(collect);
        };
        collect(feature.geometry.coordinates);
        const lngs = positions.map((p) => p[0]);
        const lats = positions.map((p) => p[1]);
        const bounds = {
          getCenter: () => [
            (Math.min(...lats) + Math.max(...lats)) / 2,
            (Math.min(...lngs) + Math.max(...lngs)) / 2
          ],
          getEast: () => Math.max(...lngs),
          getWest: () => Math.min(...lngs),
          getNorth: () => Math.max(...lats),
          getSouth: () => Math.min(...lats)
        };
        options.onEachFeature(feature, { getBounds: () => bounds });
      });
      return { addTo: mockGeoJsonAddTo, remove: vi.fn() };
    }),
    circleMarker: vi.fn(() => ({
      bindPopup: mockCircleMarkerBindPopup,
      addTo: mockCircleMarkerAddTo,
      remove: vi.fn()
    })),
    polyline: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn()
    })),
    circle: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn()
    }))
  }
}));

const ALL_LAYERS = { sensors: true, plumes: true, traffic: true, sensitive: true, windFlow: true };
const selectedWard = { id: 'wazirpur', name: 'Wazirpur Industrial Sector', aqi: 415 };

// Rajasthan is large (9 x 7 degrees) so it is labelled at the India-wide
// zoom 5 view; Goa is tiny (0.4 x 0.4 degrees) so its label waits for zoom 6+.
const TEST_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { NAME_1: 'Rajasthan' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [69, 23],
            [78, 23],
            [78, 30],
            [69, 30],
            [69, 23]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { NAME_1: 'Goa' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.8, 15.2],
            [74.2, 15.2],
            [74.2, 15.6],
            [73.8, 15.6],
            [73.8, 15.2]
          ]
        ]
      }
    }
  ]
};

const originalFetch = globalThis.fetch;

describe('useThreatMapLeaflet state boundaries and location', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapGetZoom.mockReturnValue(5);
    mockGeoJsonAddTo.mockReturnThis();
    mockCircleMarkerBindPopup.mockReturnThis();
    mockCircleMarkerAddTo.mockReturnThis();
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => TEST_GEOJSON }));
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const renderMap = () => {
    const mapContainerRef = { current: document.createElement('div') };
    const setSelectedWardId = vi.fn();
    const addToast = vi.fn();
    const hook = renderHook(() =>
      useThreatMapLeaflet(mapContainerRef, selectedWard, setSelectedWardId, addToast, ALL_LAYERS)
    );
    return { ...hook, setSelectedWardId, addToast };
  };

  // 16 ward markers + 10 city markers are created before the 2 state labels.
  const stateLabelMarker = (index) => L.marker.mock.results[26 + index].value;

  const handlerFor = (eventName) => mockMapOn.mock.calls.find((call) => call[0] === eventName)[1];

  it('loads state boundaries and labels large states at the India view', async () => {
    renderMap();
    await waitFor(() => expect(L.geoJSON).toHaveBeenCalled());
    expect(L.geoJSON).toHaveBeenCalledWith(
      TEST_GEOJSON,
      expect.objectContaining({ style: expect.anything() })
    );
    expect(mockGeoJsonAddTo).toHaveBeenCalled();

    const labelIcons = L.divIcon.mock.calls.filter(
      (call) => call[0].className === 'aura-state-label'
    );
    expect(labelIcons.map((call) => call[0].html)).toEqual(
      expect.arrayContaining([expect.stringContaining('Rajasthan'), expect.stringContaining('Goa')])
    );
    // Rajasthan is labelled at zoom 5; tiny Goa waits for a closer zoom.
    expect(stateLabelMarker(0).addTo).toHaveBeenCalled();
    expect(stateLabelMarker(1).addTo).not.toHaveBeenCalled();
  });

  it('shows small-state labels after zooming in', async () => {
    renderMap();
    await waitFor(() => expect(L.geoJSON).toHaveBeenCalled());
    expect(stateLabelMarker(1).addTo).not.toHaveBeenCalled();

    mockMapGetZoom.mockReturnValue(7);
    handlerFor('zoomend')();
    expect(stateLabelMarker(1).addTo).toHaveBeenCalled();
  });

  it('keeps the map working when the state file fails to load', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('offline in tests')));
    renderMap();
    await waitFor(() => expect(L.map).toHaveBeenCalled());
    // Give the rejected fetch a tick to settle; nothing may throw.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(L.geoJSON).not.toHaveBeenCalled();
    expect(L.map).toHaveBeenCalled();
  });

  it('locateMe centres the map on the user position', () => {
    const { result } = renderMap();
    result.current.locateMe();
    expect(mockMapLocate).toHaveBeenCalledWith({ setView: true, maxZoom: 12 });
  });

  it('locationfound drops a you-are-here marker and toasts', () => {
    const { addToast } = renderMap();
    handlerFor('locationfound')({ latlng: [28.6, 77.2] });
    expect(L.circleMarker).toHaveBeenCalledWith(
      [28.6, 77.2],
      expect.objectContaining({ fillColor: '#22d3ee' })
    );
    expect(mockCircleMarkerAddTo).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(
      'Location Found',
      expect.stringContaining('current position'),
      'cyan'
    );
  });

  it('locationerror toasts when geolocation is denied', () => {
    const { addToast } = renderMap();
    handlerFor('locationerror')();
    expect(addToast).toHaveBeenCalledWith(
      'Location Unavailable',
      expect.stringContaining('location access'),
      'red'
    );
  });
});

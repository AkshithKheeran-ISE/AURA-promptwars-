import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useThreatMapLeaflet } from '../../src/hooks/useThreatMapLeaflet';

const mockMapRemove = vi.fn();
const mockMapOn = vi.fn();
const mockMapOff = vi.fn();
const mockMapLocate = vi.fn();
const mockMapGetZoom = vi.fn(() => 5);
const mockTileLayerAddTo = vi.fn();
const mockMarkerAddTo = vi.fn();
const mockMarkerBindPopup = vi.fn().mockReturnThis();
const mockMarkerOn = vi.fn().mockReturnThis();
const mockMarkerRemove = vi.fn();

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      remove: mockMapRemove,
      on: mockMapOn,
      off: mockMapOff,
      locate: mockMapLocate,
      getZoom: mockMapGetZoom
    })),
    tileLayer: vi.fn(() => ({
      addTo: mockTileLayerAddTo
    })),
    geoJSON: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn()
    })),
    circleMarker: vi.fn(() => ({
      bindPopup: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn()
    })),
    divIcon: vi.fn(() => ({})),
    marker: vi.fn(() => ({
      bindPopup: mockMarkerBindPopup,
      on: mockMarkerOn,
      addTo: mockMarkerAddTo,
      remove: mockMarkerRemove
    })),
    polyline: vi.fn(() => ({
      addTo: vi.fn()
    })),
    circle: vi.fn(() => ({
      addTo: vi.fn()
    }))
  }
}));

describe('useThreatMapLeaflet Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapGetZoom.mockReturnValue(5);
    // The state GeoJSON is an optional layer; in these tests it never loads.
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('offline in tests')));
  });

  it('safely handles null container ref without throwing', () => {
    const mapContainerRef = { current: null };
    const selectedWard = { id: 'ward-anand-vihar', name: 'Anand Vihar', aqi: 412 };
    const setSelectedWardId = vi.fn();
    const addToast = vi.fn();
    const layers = { sensors: true, plumes: true, traffic: true };

    expect(() => {
      renderHook(() =>
        useThreatMapLeaflet(mapContainerRef, selectedWard, setSelectedWardId, addToast, layers)
      );
    }).not.toThrow();

    expect(mockMapRemove).not.toHaveBeenCalled();
  });

  it('initializes Leaflet map on valid container and removes map on unmount', () => {
    const dummyDiv = document.createElement('div');
    const mapContainerRef = { current: dummyDiv };
    const selectedWard = { id: 'ward-anand-vihar', name: 'Anand Vihar', aqi: 412 };
    const setSelectedWardId = vi.fn();
    const addToast = vi.fn();
    const layers = { sensors: true, plumes: true, traffic: true };

    const { unmount } = renderHook(() =>
      useThreatMapLeaflet(mapContainerRef, selectedWard, setSelectedWardId, addToast, layers)
    );

    expect(mockTileLayerAddTo).toHaveBeenCalled();

    unmount();

    expect(mockMapRemove).toHaveBeenCalledTimes(1);
  });
});

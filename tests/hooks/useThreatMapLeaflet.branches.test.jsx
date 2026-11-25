import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useThreatMapLeaflet } from '../../src/hooks/useThreatMapLeaflet';

const mockMapRemove = vi.fn();
const mockTileLayerAddTo = vi.fn();
const mockMarkerAddTo = vi.fn();
const mockMarkerRemove = vi.fn();
const mockMarkerBindPopup = vi.fn();
const mockMarkerOn = vi.fn();
const mockMarkerGetElement = vi.fn();
const mockPolylineAddTo = vi.fn();
const mockCircleAddTo = vi.fn();
const mockPolylineRemove = vi.fn();
const mockCircleRemove = vi.fn();

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      remove: mockMapRemove
    })),
    tileLayer: vi.fn(() => ({
      addTo: mockTileLayerAddTo
    })),
    divIcon: vi.fn(() => ({})),
    marker: vi.fn(() => ({
      bindPopup: mockMarkerBindPopup,
      on: mockMarkerOn,
      addTo: mockMarkerAddTo,
      remove: mockMarkerRemove,
      getElement: mockMarkerGetElement
    })),
    polyline: vi.fn(() => ({
      addTo: mockPolylineAddTo,
      remove: mockPolylineRemove
    })),
    circle: vi.fn(() => ({
      addTo: mockCircleAddTo,
      remove: mockCircleRemove
    }))
  }
}));

const ALL_LAYERS = { sensors: true, plumes: true, traffic: true, sensitive: true, windFlow: true };
const NO_LAYERS = {
  sensors: false,
  plumes: false,
  traffic: false,
  sensitive: false,
  windFlow: false
};

const selectedWard = { id: 'wazirpur', name: 'Wazirpur Industrial Sector', aqi: 415 };

describe('useThreatMapLeaflet branch coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Real Leaflet layers are chainable: addTo/bindPopup/on return the layer.
    // The hook stores addTo() results in markersRef and calls .remove() on them,
    // so the mocks must return `this` too.
    mockMarkerBindPopup.mockReturnThis();
    mockMarkerOn.mockReturnThis();
    mockMarkerAddTo.mockReturnThis();
    mockPolylineAddTo.mockReturnThis();
    mockCircleAddTo.mockReturnThis();
    mockMarkerGetElement.mockReturnValue(document.createElement('div'));
  });

  const renderMap = (layers = ALL_LAYERS, ward = selectedWard) => {
    const mapContainerRef = { current: document.createElement('div') };
    const setSelectedWardId = vi.fn();
    const addToast = vi.fn();
    const hook = renderHook(
      ({ layers: l, ward: w }) =>
        useThreatMapLeaflet(mapContainerRef, w, setSelectedWardId, addToast, l),
      { initialProps: { layers, ward } }
    );
    return { ...hook, setSelectedWardId, addToast };
  };

  it('creates markers, traffic corridor and plume circles when all layers are on', () => {
    renderMap();
    // 16 wards in the data set
    expect(mockMarkerAddTo).toHaveBeenCalledTimes(16);
    expect(mockPolylineAddTo).toHaveBeenCalledTimes(1);
    // 11 wards have Critical status
    expect(mockCircleAddTo).toHaveBeenCalledTimes(11);
  });

  it('creates nothing when all layers are off', () => {
    renderMap(NO_LAYERS);
    expect(mockMarkerAddTo).not.toHaveBeenCalled();
    expect(mockPolylineAddTo).not.toHaveBeenCalled();
    expect(mockCircleAddTo).not.toHaveBeenCalled();
  });

  it('creates markers but no corridor or plumes when only sensors are on', () => {
    renderMap({ ...NO_LAYERS, sensors: true });
    expect(mockMarkerAddTo).toHaveBeenCalledTimes(16);
    expect(mockPolylineAddTo).not.toHaveBeenCalled();
    expect(mockCircleAddTo).not.toHaveBeenCalled();
  });

  it('selects a ward and toasts when a marker is clicked', () => {
    const { setSelectedWardId, addToast } = renderMap();
    const clickCalls = mockMarkerOn.mock.calls.filter(([evt]) => evt === 'click');
    expect(clickCalls.length).toBe(16);

    // Click the first marker (Wazirpur)
    clickCalls[0][1]();
    expect(setSelectedWardId).toHaveBeenCalledWith('wazirpur');
    expect(addToast).toHaveBeenCalledWith(
      'Sensor Selected',
      expect.stringContaining('Wazirpur Industrial Sector'),
      'cyan'
    );
  });

  it('sets aria attributes on the marker element when it is added to the map', () => {
    renderMap();
    const addCalls = mockMarkerOn.mock.calls.filter(([evt]) => evt === 'add');
    expect(addCalls.length).toBe(16);

    addCalls[0][1]();
    const el = mockMarkerGetElement.mock.results[0].value;
    expect(el.getAttribute('aria-label')).toContain('Wazirpur Industrial Sector');
    expect(el.getAttribute('aria-label')).toContain('AQI 415');
  });

  it('does not throw when the marker element is missing on add', () => {
    mockMarkerGetElement.mockReturnValue(null);
    renderMap();
    const addCalls = mockMarkerOn.mock.calls.filter(([evt]) => evt === 'add');
    expect(() => addCalls[0][1]()).not.toThrow();
  });

  it('removes old markers and re-creates them when the selected ward changes', () => {
    const { rerender } = renderMap();
    expect(mockMarkerAddTo).toHaveBeenCalledTimes(16);

    rerender({
      layers: ALL_LAYERS,
      ward: { id: 'lodhi_road', name: 'Lodhi Road Heritage Arboretum', aqi: 95 }
    });
    expect(mockMarkerRemove).toHaveBeenCalled();
    expect(mockMarkerAddTo).toHaveBeenCalledTimes(32);
  });

  it('removes markers when the sensors layer is toggled off', () => {
    const { rerender } = renderMap();
    expect(mockMarkerAddTo).toHaveBeenCalledTimes(16);

    rerender({ layers: { ...ALL_LAYERS, sensors: false }, ward: selectedWard });
    expect(mockMarkerRemove).toHaveBeenCalled();
    expect(mockMarkerAddTo).toHaveBeenCalledTimes(16);
  });
});

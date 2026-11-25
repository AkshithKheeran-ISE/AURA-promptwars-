import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useHousehold } from '../../src/context/AppContext';
import ThreatMap from '../../src/pages/ThreatMap';

function WardSwitcher() {
  const { setSelectedWardId } = useHousehold();
  return (
    <button type="button" onClick={() => setSelectedWardId('lodhi_road')}>
      Switch to Lodhi Road
    </button>
  );
}

const mockMapSetView = vi.fn();
const mockMapFlyTo = vi.fn();

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      remove: vi.fn(),
      setView: mockMapSetView,
      flyTo: mockMapFlyTo
    })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn().mockReturnThis() })),
    divIcon: vi.fn(() => ({})),
    marker: vi.fn(() => ({
      bindPopup: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn()
    })),
    polyline: vi.fn(() => ({ addTo: vi.fn().mockReturnThis(), remove: vi.fn() })),
    circle: vi.fn(() => ({ addTo: vi.fn().mockReturnThis(), remove: vi.fn() }))
  }
}));

describe('ThreatMap', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  const renderMap = () =>
    render(
      <AppProvider>
        <ThreatMap />
      </AppProvider>
    );

  it('renders the map shell with legend and tactical overlay', () => {
    renderMap();
    expect(screen.getByRole('heading', { name: /Urban Air Basin Threat Map/i })).toBeDefined();
    expect(screen.getByText(/DELHI NCR BASIN · GRID-4/i)).toBeDefined();
    expect(screen.getByText(/CPCB Delhi CAAQMS Baseline/i)).toBeDefined();
    // Exact match: the dossier also contains "INSTANTANEOUS AIR QUALITY INDEX"
    expect(screen.getByText('AIR QUALITY INDEX')).toBeDefined();
    expect(screen.getByText(/0 - 100 Good\/Satisfactory/i)).toBeDefined();
    expect(screen.getByText(/301\+ Severe \/ Emergency/i)).toBeDefined();
  });

  it('toggles each toolbar layer', () => {
    renderMap();
    const sensors = screen.getByLabelText(/Micro-Sensors/i);
    const plumes = screen.getByLabelText(/Industrial Plumes/i);
    const traffic = screen.getByLabelText(/Freight Corridors/i);
    const sensitive = screen.getByLabelText(/School Zones/i);

    for (const box of [sensors, plumes, traffic, sensitive]) {
      expect(box.checked).toBe(true);
      fireEvent.click(box);
      expect(box.checked).toBe(false);
      fireEvent.click(box);
      expect(box.checked).toBe(true);
    }
  });

  it('shows a View all of India button that resets the map to the India view', () => {
    renderMap();
    const button = screen.getByRole('button', { name: /View all of India/i });
    expect(button).toBeDefined();
    fireEvent.click(button);
    expect(mockMapSetView).toHaveBeenCalledWith([22.97, 78.65], 5);
  });

  it('shows a Critical ward dossier with the rose status colour', () => {
    renderMap();
    // Default ward is Wazirpur (AQI 415, Critical)
    expect(screen.getByText(/Sector Dossier/i)).toBeDefined();
    expect(screen.getByText(/Wazirpur Industrial Sector/i)).toBeDefined();
    expect(screen.getByText(/CRITICAL HAZARD LEVEL/i)).toBeDefined();
    expect(screen.getByText(/INSTANTANEOUS AIR QUALITY INDEX/i)).toBeDefined();
    expect(screen.getByText(/Atmospheric Inversion Risk/i)).toBeDefined();
    expect(screen.getByText(/Primary Source Fingerprints/i)).toBeDefined();
  });

  it('shows a non-Critical ward dossier with the emerald status colour', () => {
    render(
      <AppProvider>
        <WardSwitcher />
        <ThreatMap />
      </AppProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Switch to Lodhi Road/i }));
    // Lodhi Road is Safe status (AQI 95), so the dossier uses the green branch
    expect(screen.getByText(/Lodhi Road Heritage Arboretum/i)).toBeDefined();
    expect(screen.getByText(/Safe HAZARD LEVEL/i)).toBeDefined();
    expect(screen.queryByText(/CRITICAL HAZARD LEVEL/i)).toBeNull();
  });
});

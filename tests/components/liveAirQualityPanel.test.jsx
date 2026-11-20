import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LiveAirQualityPanel from '../../src/components/live/LiveAirQualityPanel';
import { normalizeSnapshot } from '../../src/services/liveAirQuality';

const NOW = new Date('2026-01-15T10:30:00.000Z');

function makeSnapshot() {
  return normalizeSnapshot(
    {
      latitude: 28.61,
      longitude: 77.21,
      timezone: 'Asia/Kolkata',
      hourly: {
        time: ['2026-01-15T10:00'],
        pm2_5: [210],
        pm10: [340],
        carbon_monoxide: [1500],
        nitrogen_dioxide: [72],
        ozone: [25],
        us_aqi: [185],
        european_aqi: [98]
      }
    },
    {
      hourly: {
        time: ['2026-01-15T10:00'],
        temperature_2m: [11],
        relative_humidity_2m: [72],
        wind_speed_10m: [6],
        wind_direction_10m: [310],
        boundary_layer_height: [140]
      }
    },
    { name: 'Delhi', country: 'India' },
    NOW
  );
}

function makeLive(overrides = {}) {
  return {
    status: 'live',
    snapshot: makeSnapshot(),
    error: null,
    place: { name: 'Delhi', country: 'India' },
    searchResults: [],
    searching: false,
    search: vi.fn(async () => []),
    selectPlace: vi.fn(async () => null),
    refresh: vi.fn(async () => null),
    loadFor: vi.fn(async () => null),
    ...overrides
  };
}

describe('LiveAirQualityPanel', () => {
  it('renders the live snapshot with category, metrics and impact explanation', () => {
    render(<LiveAirQualityPanel liveOverride={makeLive()} />);
    expect(screen.getByRole('heading', { name: /Live air quality for your city/i })).toBeDefined();
    expect(screen.getByText('185')).toBeDefined();
    expect(screen.getByText(/Unhealthy/)).toBeDefined();
    expect(screen.getByText('LIVE')).toBeDefined();
    expect(screen.getByText(/Direct impact, explained:/)).toBeDefined();
    expect(screen.getByText(/Stay sealed/)).toBeDefined();
    expect(screen.getAllByText(/210/).length).toBeGreaterThan(0);
  });

  it('has a labelled city search whose visible label matches its accessible name', () => {
    const live = makeLive();
    render(<LiveAirQualityPanel liveOverride={live} />);
    const input = screen.getByLabelText(/Search your city/i);
    expect(input).toBeDefined();
    fireEvent.change(input, { target: { value: 'Mumbai' } });
    fireEvent.click(screen.getByRole('button', { name: /Search city/i }));
    expect(live.search).toHaveBeenCalledWith('Mumbai');
  });

  it('lists search results as buttons and loads the chosen city', () => {
    const live = makeLive({
      searchResults: [
        {
          name: 'Mumbai',
          admin1: 'Maharashtra',
          country: 'India',
          latitude: 19.07,
          longitude: 72.87
        }
      ]
    });
    render(<LiveAirQualityPanel liveOverride={live} />);
    fireEvent.click(screen.getByRole('button', { name: /Mumbai, Maharashtra, India/i }));
    expect(live.selectPlace).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Mumbai', latitude: 19.07 })
    );
  });

  it('wires the refresh button', () => {
    const live = makeLive();
    render(<LiveAirQualityPanel liveOverride={live} />);
    fireEvent.click(screen.getByRole('button', { name: /Refresh live data/i }));
    expect(live.refresh).toHaveBeenCalledTimes(1);
  });

  it('shows an honest offline message and no fake live data on error', () => {
    render(
      <LiveAirQualityPanel
        liveOverride={makeLive({ status: 'error', snapshot: null, error: 'network down' })}
      />
    );
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/statutory CPCB baseline/i)).toBeDefined();
    expect(screen.getByText(/OFFLINE/)).toBeDefined();
  });

  it('shows a loading status while the first snapshot loads', () => {
    render(<LiveAirQualityPanel liveOverride={makeLive({ status: 'loading', snapshot: null })} />);
    expect(screen.getByText(/Loading live air quality/i)).toBeDefined();
  });

  it('shows a searching status while geocoding runs', () => {
    render(<LiveAirQualityPanel liveOverride={makeLive({ searching: true })} />);
    expect(screen.getByText(/Searching free geocoding/i)).toBeDefined();
  });
});

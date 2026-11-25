import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { AppProvider } from '../src/context/AppContext';
import CommandCenter from '../src/pages/CommandCenter';
import DailyRoutines from '../src/pages/DailyRoutines';
import IndoorAirHacks from '../src/pages/IndoorAirHacks';
import SustainableAlternatives from '../src/pages/SustainableAlternatives';
import ThreatMap from '../src/pages/ThreatMap';
import AlertCenter from '../src/pages/AlertCenter';
import CitizenReports from '../src/pages/CitizenReports';
import AgentSystem from '../src/pages/AgentSystem';
import Forecast from '../src/pages/Forecast';
import AuditTrail from '../src/pages/AuditTrail';
import BootScreen from '../src/components/BootScreen';
import AgeGuidance from '../src/components/live/AgeGuidance';

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      remove: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      locate: vi.fn(),
      getZoom: vi.fn(() => 5)
    })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    geoJSON: vi.fn(() => ({ addTo: vi.fn().mockReturnThis(), remove: vi.fn() })),
    circleMarker: vi.fn(() => ({
      bindPopup: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn()
    })),
    divIcon: vi.fn(() => ({})),
    marker: vi.fn(() => ({
      bindPopup: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      addTo: vi.fn(),
      remove: vi.fn()
    })),
    polyline: vi.fn(() => ({ addTo: vi.fn() })),
    circle: vi.fn(() => ({ addTo: vi.fn() }))
  }
}));

/**
 * Static axe-core scan of every route in jsdom. Color-contrast is disabled
 * here — it needs real layout and is covered by the Playwright axe scan in
 * e2e/aura.spec.js, which runs in CI. Anything else must be violation-free.
 */
const AXE_OPTIONS = {
  rules: { 'color-contrast': { enabled: false } }
};

const PAGES = [
  ['CommandCenter', CommandCenter],
  ['DailyRoutines', DailyRoutines],
  ['IndoorAirHacks', IndoorAirHacks],
  ['SustainableAlternatives', SustainableAlternatives],
  ['ThreatMap', ThreatMap],
  ['AlertCenter', AlertCenter],
  ['CitizenReports', CitizenReports],
  ['AgentSystem', AgentSystem],
  ['Forecast', Forecast],
  ['AuditTrail', AuditTrail]
];

describe('axe accessibility scans (jsdom, static rules)', () => {
  it.each(PAGES)('%s has no axe violations', async (_name, Page) => {
    const { container } = render(
      <AppProvider>
        <Page />
      </AppProvider>
    );
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });

  it('BootScreen has no axe violations', async () => {
    const { container } = render(<BootScreen />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });

  it('AgeGuidance has no axe violations (with a live snapshot loaded)', async () => {
    const { container } = render(<AgeGuidance snapshot={{ pm25: 40, usAqi: 112 }} />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});

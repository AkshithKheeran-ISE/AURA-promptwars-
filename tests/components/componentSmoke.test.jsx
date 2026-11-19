import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';
import CitizenReports from '../../src/pages/CitizenReports';
import CommandCenter from '../../src/pages/CommandCenter';
import AgentSystem from '../../src/pages/AgentSystem';
import AlertCenter from '../../src/pages/AlertCenter';
import AuditTrail from '../../src/pages/AuditTrail';
import DailyRoutines from '../../src/pages/DailyRoutines';
import Forecast from '../../src/pages/Forecast';
import IndoorAirHacks from '../../src/pages/IndoorAirHacks';
import SustainableAlternatives from '../../src/pages/SustainableAlternatives';
import ThreatMap from '../../src/pages/ThreatMap';

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({ remove: vi.fn() })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
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

describe('UI Component Behavioral Smoke Tests', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('renders CitizenReports and shows alert banner when Simulate Tamper is clicked', async () => {
    render(
      <AppProvider>
        <CitizenReports />
      </AppProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();

    const tamperBtn = screen.getByRole('button', { name: /Simulate Tamper/i });
    expect(tamperBtn).toBeDefined();

    fireEvent.click(tamperBtn);

    await waitFor(() => {
      expect(screen.getByText(/SECURITY ALERT: Cryptographic Chain Broken!/i)).toBeDefined();
    });

    const repairBtn = screen.getByRole('button', {
      name: /Run Zero-Data-Loss Repair Engine/i
    });
    expect(repairBtn).toBeDefined();
    fireEvent.click(repairBtn);

    await waitFor(() => {
      expect(screen.queryByText(/SECURITY ALERT: Cryptographic Chain Broken!/i)).toBeNull();
    });
  });

  it('renders CommandCenter with executive metrics and ward grid', () => {
    render(
      <AppProvider>
        <CommandCenter />
      </AppProvider>
    );

    expect(
      screen.getByRole('heading', {
        name: /Family & Community Smog Command Center/i
      })
    ).toBeDefined();

    expect(screen.getByText(/SIMULATED IOT MESH/i)).toBeDefined();
    expect(screen.getByText(/WRF-CHEM SIMULATION/i)).toBeDefined();
  });

  it('renders AgentSystem with verifiable agent mesh roster and terminal', () => {
    render(
      <AppProvider>
        <AgentSystem />
      </AppProvider>
    );

    expect(
      screen.getByRole('heading', {
        name: /Autonomous Environmental Multi-Agent Mesh/i
      })
    ).toBeDefined();

    expect(screen.getByText(/GenAI Smog Assistant Terminal/i)).toBeDefined();
  });

  it.each([
    ['AlertCenter', AlertCenter, /Air Quality Alert/i],
    ['AuditTrail', AuditTrail, /Cryptographic Action History/i],
    ['DailyRoutines', DailyRoutines, /06:30 – 08:30/i],
    ['Forecast', Forecast, /Atmospheric Hazard Horizon/i],
    ['IndoorAirHacks', IndoorAirHacks, /Corsi-Rosenthal/i],
    ['SustainableAlternatives', SustainableAlternatives, /Metro/i],
    ['ThreatMap', ThreatMap, /Urban Air Basin Threat Map/i]
  ])('renders %s with its primary heading or identifier', async (_name, Page, heading) => {
    render(
      <AppProvider>
        <Page />
      </AppProvider>
    );
    expect(await screen.findByText(heading)).toBeDefined();
  });
});

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';
import App from '../../src/App';
import BootScreen from '../../src/components/BootScreen';
import ErrorBoundary from '../../src/components/ErrorBoundary';
import SectionHeader from '../../src/components/SectionHeader';
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

  it('renders App root shell, Header, Sidebar, LiveTicker, and navigates via sidebar', async () => {
    window.sessionStorage.setItem('aura-boot', '1');
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Header & Ticker elements
    expect(screen.getByText(/Priya Family Lead/i)).toBeDefined();
    expect(screen.getByText(/SIMULATED TELEMETRY/i)).toBeDefined();

    // Skip to main content link
    expect(screen.getByText(/Skip to main content/i)).toBeDefined();

    // Sidebar navigation to Daily Routines
    const routinesBtn = screen.getByRole('button', { name: /Daily Routines/i });
    fireEvent.click(routinesBtn);
    expect(await screen.findByText(/06:30 – 08:30/i)).toBeDefined();

    // Toggle sidebar collapse
    const collapseBtn = screen.getByRole('button', { name: /Collapse Sidebar/i });
    fireEvent.click(collapseBtn);
    expect(screen.getByRole('button', { name: /Expand Sidebar/i })).toBeDefined();

    // Open Command Palette via Header search
    const searchBtn = screen.getByLabelText(/Search or open command palette/i);
    fireEvent.click(searchBtn);
    expect(screen.getByRole('dialog', { name: /Command Palette/i })).toBeDefined();

    // Search query in Command Palette
    const searchInput = screen.getByLabelText(/Search modules and actions/i);
    fireEvent.change(searchInput, { target: { value: 'Corsi' } });
    expect(screen.getByText(/Toggle DIY Corsi-Rosenthal Box Filtration/i)).toBeDefined();

    // Close Command Palette
    const closePaletteBtn = screen.getByLabelText(/Close command palette/i);
    fireEvent.click(closePaletteBtn);
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();
    });
  });

  it('renders BootScreen and allows skipping boot sequence to enter interface', () => {
    const onDone = vi.fn();
    render(<BootScreen onDone={onDone} />);

    expect(screen.getByRole('heading', { level: 1, name: /AURA/i })).toBeDefined();
    expect(
      screen.getByText(/Atmospheric Understanding & Real-time Air Quality Intelligence/i)
    ).toBeDefined();

    const skipBtn = screen.getByRole('button', { name: /Skip Boot Sequence/i });
    fireEvent.click(skipBtn);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('renders SectionHeader with title, eyebrow, and custom action button', () => {
    render(
      <SectionHeader
        eyebrow="01 · Real-Time Telemetry"
        title="Atmospheric Command Unit"
        desc="Urban air monitoring dashboard."
        right={<button type="button">Telemetry Action</button>}
      />
    );
    expect(
      screen.getByRole('heading', { level: 1, name: /Atmospheric Command Unit/i })
    ).toBeDefined();
    expect(screen.getByText(/01 · Real-Time Telemetry/i)).toBeDefined();
    expect(screen.getByText(/Urban air monitoring dashboard./i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Telemetry Action/i })).toBeDefined();
  });

  it('renders ErrorBoundary and displays recovery interface upon uncaught fault', () => {
    const ThrowingComponent = () => {
      throw new Error('Test atmospheric fault');
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/Atmospheric Interface Fault Intercepted/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Re-initialize Command Module/i })).toBeDefined();

    consoleErrorSpy.mockRestore();
  });

  it('exercises SustainableAlternatives pledge toggle and neighborhood scale slider', async () => {
    render(
      <AppProvider>
        <SustainableAlternatives />
      </AppProvider>
    );

    // Neighborhood scale slider
    const slider = screen.getByLabelText(/Neighborhood household scale multiplier/i);
    fireEvent.change(slider, { target: { value: 120 } });
    expect(screen.getByText(/120 Families/i)).toBeDefined();

    // Toggle pledge off and on
    const pledgedButtons = screen.getAllByRole('button', { name: /PLEDGED/i });
    expect(pledgedButtons.length).toBeGreaterThan(0);
    fireEvent.click(pledgedButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/1 Sustainable Alternatives Adopted/i)).toBeDefined();
    });

    const adoptButtons = screen.getAllByRole('button', { name: /ADOPT CLEAN ALTERNATIVE/i });
    fireEvent.click(adoptButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/2 Sustainable Alternatives Adopted/i)).toBeDefined();
    });
  });
});

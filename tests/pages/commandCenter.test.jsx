import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useUi } from '../../src/context/AppContext';
import CommandCenter from '../../src/pages/CommandCenter';

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({ remove: vi.fn() })),
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

function PageProbe() {
  const { page } = useUi();
  return <div data-testid="current-page">{page}</div>;
}

describe('CommandCenter', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('offline in tests')));
  });

  const renderCenter = () =>
    render(
      <AppProvider>
        <PageProbe />
        <CommandCenter />
      </AppProvider>
    );

  it('renders the command center with metrics, provenance and checklist', () => {
    renderCenter();
    expect(
      screen.getByRole('heading', { name: /Family & Community Smog Command Center/i })
    ).toBeDefined();
    expect(screen.getByText(/Environmental Data Provenance/i)).toBeDefined();
    expect(screen.getByText(/Active Defense Checklist/i)).toBeDefined();
    expect(screen.getByText(/SIMULATED IOT MESH/i)).toBeDefined();
  });

  it('shows the outdoor AQI per selected ward', () => {
    renderCenter();
    // Default ward is Wazirpur (AQI 415) — shown in the metric card and the ward grid
    expect(screen.getAllByText(/AQI 415/i).length).toBeGreaterThan(0);

    // Lodhi Road (AQI 95) -> green band; Siri Fort (185) -> amber; R.K. Puram (245) -> orange
    fireEvent.click(screen.getByRole('button', { name: /Lodhi Road Heritage Arboretum/i }));
    expect(screen.getAllByText(/AQI 95/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /Siri Fort Sports & Green Belt/i }));
    expect(screen.getAllByText(/AQI 185/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /R\.K\. Puram Institutional Sector/i }));
    expect(screen.getAllByText(/AQI 245/i).length).toBeGreaterThan(0);
  });

  it('switches the family archetype profile', () => {
    renderCenter();
    fireEvent.click(
      screen.getByRole('button', { name: /Multi-Generational with Asthmatic Senior/i })
    );
    expect(screen.getByText(/Multi-Generational with Asthmatic Senior/i)).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: /Working Parents & Outdoor Commuters/i }));
    expect(screen.getByText(/Working Parents & Outdoor Commuters/i)).toBeDefined();
  });

  it('changes the target ward from the toolbar select', () => {
    renderCenter();
    const select = screen.getByLabelText(/Select target monitoring ward/i);
    fireEvent.change(select, { target: { value: 'dwarka' } });
    expect(select.value).toBe('dwarka');
    // Metric card, ward grid and select option all show the new ward name
    expect(screen.getAllByText(/Dwarka Sector 8 Sub-City/i).length).toBeGreaterThan(0);
  });

  it('navigates via the shortcut buttons and the checklist link', () => {
    renderCenter();
    fireEvent.click(screen.getByRole('button', { name: /Smog Routines/i }));
    expect(screen.getByTestId('current-page').textContent).toBe('routines');

    fireEvent.click(screen.getByRole('button', { name: /DIY IAQ Hacks/i }));
    expect(screen.getByTestId('current-page').textContent).toBe('hacks');

    fireEvent.click(screen.getByRole('button', { name: /Clean Alternatives/i }));
    expect(screen.getByTestId('current-page').textContent).toBe('alternatives');

    fireEvent.click(screen.getByRole('button', { name: /Explore All 6 Low-Cost IAQ Hacks/i }));
    expect(screen.getByTestId('current-page').textContent).toBe('hacks');
  });

  it('navigates to the map from the ward grid', () => {
    renderCenter();
    const mapBtn = screen.getByRole('button', { name: /Open Neighborhood Safe Corridors/i });
    fireEvent.click(mapBtn);
    expect(screen.getByTestId('current-page').textContent).toBe('map');
  });

  it('shows the provenance badge fallback for tiers without badge text', () => {
    renderCenter();
    // The provenance bar renders every tier; several tiers lack badge text and
    // use the SIMULATION / MODEL fallback, at least one uses STATUTORY REAL.
    expect(screen.getAllByText(/SIMULATION \/ MODEL/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/STATUTORY REAL/i).length).toBeGreaterThan(0);
  });
});

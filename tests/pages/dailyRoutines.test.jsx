import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';
import DailyRoutines from '../../src/pages/DailyRoutines';

vi.mock('../../src/hooks/useLiveAirQuality', () => ({
  useLiveAirQuality: () => ({
    status: 'live',
    snapshot: {
      pm25: 40,
      usAqi: 50,
      placeName: 'Delhi',
      sourceLabel: 'Open-Meteo / CAMS',
      observedAt: '10:00',
      boundaryLayerHeightM: 2000,
      category: { label: 'Moderate', color: '#fbbf24' }
    }
  })
}));

describe('DailyRoutines', () => {
  const renderPage = () =>
    render(
      <AppProvider>
        <DailyRoutines />
      </AppProvider>
    );

  it('shows the live-air banner when the free API answers', () => {
    renderPage();
    expect(screen.getByText(/Live right now in Delhi/i)).toBeDefined();
    expect(screen.getByText(/PM2.5 40 µg\/m³ · US AQI 50/i)).toBeDefined();
    expect(screen.getByText(/Golden window/i)).toBeDefined();
  });

  it('switches the household archetype on click', () => {
    renderPage();
    const asthma = screen.getByRole('button', {
      name: /Multi-Generational with Asthmatic Senior/i
    });
    expect(asthma.className).not.toContain('bg-cyan-400/20');

    fireEvent.click(asthma);
    expect(asthma.className).toContain('bg-cyan-400/20');
  });

  it('changes the dwelling type from the select', () => {
    renderPage();
    const select = screen.getByLabelText('Select household dwelling type');
    expect(select.value).toBe('apartment_high');

    fireEvent.change(select, { target: { value: 'apartment_low' } });
    expect(select.value).toBe('apartment_low');
  });
});

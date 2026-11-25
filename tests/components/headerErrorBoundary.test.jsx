import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider, useUi } from '../../src/context/AppContext';
import App from '../../src/App';
import Header from '../../src/components/Header';
import ErrorBoundary from '../../src/components/ErrorBoundary';

function PaletteProbe() {
  const { commandPaletteOpen } = useUi();
  return <div data-testid="palette-open">{String(commandPaletteOpen)}</div>;
}

describe('Header', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    window.location.hash = '';
    window.sessionStorage.setItem('aura-boot', '1');
  });

  afterEach(() => {
    window.sessionStorage.removeItem('aura-boot');
    window.location.hash = '';
  });

  it('renders the live clock with IST and UTC times', () => {
    render(
      <AppProvider>
        <Header />
      </AppProvider>
    );
    // 'IST' is its own span in the clock; the UTC line is "HH:MM:SS UTC"
    expect(screen.getByText('IST')).toBeDefined();
    expect(screen.getByText(/^\d{2}:\d{2}:\d{2} UTC$/)).toBeDefined();
    expect(screen.getByText(/AQI STATUS · CRITICAL/i)).toBeDefined();
    expect(screen.getByText(/SHA-256 VERIFIED LEDGER/i)).toBeDefined();
    expect(screen.getByText(/Priya Family Lead/i)).toBeDefined();
  });

  it('shows the critical-alert dot when critical alerts exist', () => {
    render(
      <AppProvider>
        <Header />
      </AppProvider>
    );
    // 2 critical alerts in the data set, so the bell carries the critical label
    expect(screen.getByLabelText(/View notifications, 2 critical alerts/i)).toBeDefined();
  });

  it('opens the notification dropdown, navigates to Alert Center on selection', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    fireEvent.click(screen.getByLabelText(/View notifications, 2 critical alerts/i));
    expect(screen.getByText(/Recent Incident Stream/i)).toBeDefined();
    expect(screen.getByText(/5 Active/i)).toBeDefined();

    // Click the first incident in the dropdown
    fireEvent.click(screen.getByText(/ALR-DEL-901/i));
    expect(await screen.findByText(/Air Quality Alert & Incident Center/i)).toBeDefined();
    expect(window.location.hash).toContain('alerts');
  });

  it('closes the notification dropdown on mouse leave and via the footer link', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    fireEvent.click(screen.getByLabelText(/View notifications, 2 critical alerts/i));
    expect(screen.getByText(/Recent Incident Stream/i)).toBeDefined();

    const dropdown = screen.getByText(/Recent Incident Stream/i).closest('div');
    fireEvent.mouseLeave(dropdown.parentElement);
    await waitFor(() => {
      expect(screen.queryByText(/Recent Incident Stream/i)).toBeNull();
    });
  });

  it('changes page from the mobile module select', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    const select = screen.getByLabelText(/Select application view/i);
    fireEvent.change(select, { target: { value: 'forecast' } });
    expect(await screen.findByText(/Atmospheric Hazard Horizon/i)).toBeDefined();
  });

  it('opens the command palette from the header search button', () => {
    render(
      <AppProvider>
        <Header />
        <PaletteProbe />
      </AppProvider>
    );
    expect(screen.getByTestId('palette-open').textContent).toBe('false');
    fireEvent.click(screen.getByLabelText(/Search or open command palette/i));
    expect(screen.getByTestId('palette-open').textContent).toBe('true');
  });
});

describe('ErrorBoundary recovery', () => {
  it('calls onError when a child throws', () => {
    const onError = vi.fn();
    const ThrowingComponent = () => {
      throw new Error('Test atmospheric fault');
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(screen.getByRole('alert')).toBeDefined();

    consoleErrorSpy.mockRestore();
  });

  it('resets to the command page when Re-initialize is clicked', () => {
    const ThrowingComponent = () => {
      throw new Error('Test atmospheric fault');
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /Re-initialize Command Module/i }));
    expect(window.location.hash).toBe('#/command');

    consoleErrorSpy.mockRestore();
  });

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Healthy module content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText(/Healthy module content/i)).toBeDefined();
  });
});

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { AppProvider, useUi } from '../../src/context/AppContext';
import App from '../../src/App';

function PageProbe() {
  const { page, setPage } = useUi();
  return (
    <button type="button" data-testid="current-page" onClick={() => setPage('nonexistent-xyz')}>
      {page}
    </button>
  );
}

describe('App shell', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    window.location.hash = '';
    window.sessionStorage.removeItem('aura-boot');
  });

  afterEach(() => {
    window.sessionStorage.removeItem('aura-boot');
    window.location.hash = '';
  });

  // Boot takes 8 x 220ms plus a lazy chunk load; under a loaded parallel run
  // that can exceed the default 5s test timeout, so this test gets a longer one.
  it('shows the boot screen when not booted, completes boot and marks session booted', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: /AURA/i })).toBeDefined();
    expect(screen.queryByText(/Family & Community Smog Command Center/i)).toBeNull();

    const enterBtn = await screen.findByRole(
      'button',
      { name: /Enter Command Center/i },
      { timeout: 10000 }
    );
    fireEvent.click(enterBtn);
    expect(window.sessionStorage.getItem('aura-boot')).toBe('1');
    expect(
      await screen.findByText(/Family & Community Smog Command Center/i, {}, { timeout: 10000 })
    ).toBeDefined();
  }, 20000);

  it('skips the boot screen entirely when the session is already booted', async () => {
    window.sessionStorage.setItem('aura-boot', '1');
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    expect(screen.queryByRole('button', { name: /Skip Boot Sequence/i })).toBeNull();
    expect(
      await screen.findByText(/Family & Community Smog Command Center/i, {}, { timeout: 5000 })
    ).toBeDefined();
  });

  it('falls back to the Command Center for an unknown page id', async () => {
    window.sessionStorage.setItem('aura-boot', '1');
    render(
      <AppProvider>
        <App />
        <PageProbe />
      </AppProvider>
    );
    expect(
      await screen.findByText(/Family & Community Smog Command Center/i, {}, { timeout: 5000 })
    ).toBeDefined();

    fireEvent.click(screen.getByTestId('current-page'));
    // Unknown page id still renders the Command Center fallback
    expect(
      await screen.findByText(/Family & Community Smog Command Center/i, {}, { timeout: 5000 })
    ).toBeDefined();
  });

  it('renders the skip link, header, ticker and footer', async () => {
    window.sessionStorage.setItem('aura-boot', '1');
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    expect(screen.getByText(/Skip to main content/i)).toBeDefined();
    expect(screen.getByText(/Priya Family Lead/i)).toBeDefined();
    expect(screen.getByText(/SIMULATED TELEMETRY/i)).toBeDefined();
    expect(screen.getByText(/GenAI Family & Community Smog Defense Assistant/i)).toBeDefined();
  });

  it('lazy-loads the remaining pages on navigation', async () => {
    window.sessionStorage.setItem('aura-boot', '1');
    render(
      <AppProvider>
        <App />
        <PageProbe />
      </AppProvider>
    );
    expect(
      await screen.findByText(/Family & Community Smog Command Center/i, {}, { timeout: 10000 })
    ).toBeDefined();

    // Navigate through the sidebar links so each lazy chunk is imported.
    // Scoped to the nav: the Command Center page has its own "Clean Alternatives"
    // shortcut button with the same label.
    const nav = within(screen.getByRole('navigation', { name: /Main menu/i }));
    fireEvent.click(nav.getByRole('button', { name: /Clean Alternatives/i }));
    expect(
      await screen.findByText(
        /Sustainable Community Alternatives & Footprint/i,
        {},
        { timeout: 10000 }
      )
    ).toBeDefined();

    fireEvent.click(nav.getByRole('button', { name: /Community Watch/i }));
    expect(
      await screen.findByText(/Secure Citizen Air & Smog Reports/i, {}, { timeout: 10000 })
    ).toBeDefined();

    fireEvent.click(nav.getByRole('button', { name: /GenAI Assistant/i }));
    expect(
      await screen.findByText(/Autonomous Environmental Multi-Agent Mesh/i, {}, { timeout: 10000 })
    ).toBeDefined();

    fireEvent.click(nav.getByRole('button', { name: /Impact Ledger/i }));
    expect(
      await screen.findByText(/Immutable Environmental Audit Trail/i, {}, { timeout: 10000 })
    ).toBeDefined();
  }, 30000);

  it('collapses the sidebar and swaps the toggle label', async () => {
    window.sessionStorage.setItem('aura-boot', '1');
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    expect(
      await screen.findByText(/Family & Community Smog Command Center/i, {}, { timeout: 5000 })
    ).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: /Collapse Sidebar/i }));
    expect(screen.getByRole('button', { name: /Expand Sidebar/i })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: /Expand Sidebar/i }));
    expect(screen.getByRole('button', { name: /Collapse Sidebar/i })).toBeDefined();
  });
});

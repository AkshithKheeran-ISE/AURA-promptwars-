import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { AppProvider, useUi } from '../../src/context/AppContext';
import CommandPalette from '../../src/components/CommandPalette';

function OpenPaletteButton() {
  const { setCommandPaletteOpen } = useUi();
  return (
    <button type="button" onClick={() => setCommandPaletteOpen(true)}>
      Open Palette
    </button>
  );
}

function renderPalette() {
  return render(
    <AppProvider>
      <OpenPaletteButton />
      <CommandPalette />
    </AppProvider>
  );
}

const openPalette = () => fireEvent.click(screen.getByRole('button', { name: 'Open Palette' }));
const dialog = () => screen.getByRole('dialog', { name: /Command Palette/i });
const searchInput = () => screen.getByLabelText(/Search modules and actions/i);

describe('CommandPalette', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    window.location.hash = '';
  });

  it('renders nothing while closed', () => {
    renderPalette();
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();
  });

  it('opens, shows quick actions, modules and wards', () => {
    renderPalette();
    openPalette();
    expect(dialog()).toBeDefined();
    expect(screen.getByText(/Tactical Quick Actions/i)).toBeDefined();
    expect(screen.getByText(/AURA Modules/i)).toBeDefined();
    expect(screen.getByText(/Urban Wards & Air Stations/i)).toBeDefined();
    expect(screen.getByText(/Toggle DIY Corsi-Rosenthal Box Filtration/i)).toBeDefined();
    expect(screen.getByText(/Simulate Cryptographic Ledger Tampering/i)).toBeDefined();
    expect(screen.getByText(/Verify & Recalculate SHA-256 Hash Chain/i)).toBeDefined();
  });

  it('filters modules and wards by query and hides the wards section on no match', () => {
    renderPalette();
    openPalette();
    fireEvent.change(searchInput(), { target: { value: 'forecast' } });
    expect(screen.getByRole('button', { name: /30-Day Outlook/i })).toBeDefined();
    expect(screen.queryByText(/Urban Wards & Air Stations/i)).toBeNull();

    fireEvent.change(searchInput(), { target: { value: 'zzzznothingmatches' } });
    expect(screen.queryByText(/Urban Wards & Air Stations/i)).toBeNull();

    fireEvent.change(searchInput(), { target: { value: 'lodhi' } });
    expect(screen.getByRole('button', { name: /Lodhi Road Heritage Arboretum/i })).toBeDefined();
  });

  it('shows the right AQI colour band per ward', () => {
    renderPalette();
    openPalette();
    fireEvent.change(searchInput(), { target: { value: 'lodhi' } });
    expect(screen.getByText(/AQI 95/i)).toBeDefined();
    fireEvent.change(searchInput(), { target: { value: 'siri' } });
    expect(screen.getByText(/AQI 185/i)).toBeDefined();
    fireEvent.change(searchInput(), { target: { value: 'rk_puram' } });
    expect(screen.getByText(/AQI 245/i)).toBeDefined();
    fireEvent.change(searchInput(), { target: { value: 'wazirpur' } });
    expect(screen.getByText(/AQI 415/i)).toBeDefined();
  });

  it('runs the Corsi quick action, navigates to hacks and closes', async () => {
    renderPalette();
    openPalette();
    fireEvent.click(screen.getByText(/Toggle DIY Corsi-Rosenthal Box Filtration/i));
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();
    expect(window.location.hash).toContain('hacks');
  });

  it('runs Simulate Tamper and Verify Ledger quick actions and closes', () => {
    renderPalette();
    openPalette();
    fireEvent.click(screen.getByText(/Simulate Cryptographic Ledger Tampering/i));
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();

    openPalette();
    fireEvent.click(screen.getByText(/Verify & Recalculate SHA-256 Hash Chain/i));
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();
  });

  it('navigates to a module on click', () => {
    renderPalette();
    openPalette();
    fireEvent.click(screen.getByRole('button', { name: /30-Day Outlook/i }));
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();
    expect(window.location.hash).toContain('forecast');
  });

  it('loads a ward, navigates to the map and closes', () => {
    renderPalette();
    openPalette();
    fireEvent.click(screen.getByRole('button', { name: /Anand Vihar/i }));
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();
    expect(window.location.hash).toContain('map');
  });

  it('closes on Escape key, backdrop click and the X button; inner clicks stay open', () => {
    renderPalette();
    openPalette();

    // Escape on the modal
    fireEvent.keyDown(dialog(), { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();

    // Backdrop click
    openPalette();
    fireEvent.click(dialog());
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();

    // X button
    openPalette();
    fireEvent.click(screen.getByLabelText(/Close command palette/i));
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();

    // Clicking inside the content panel does not close it
    openPalette();
    fireEvent.click(screen.getByLabelText(/Command Palette Content/i));
    expect(dialog()).toBeDefined();

    // Enter/Space inside the content panel is swallowed, palette stays open
    fireEvent.keyDown(screen.getByLabelText(/Command Palette Content/i), { key: 'Enter' });
    expect(dialog()).toBeDefined();
    fireEvent.keyDown(screen.getByLabelText(/Command Palette Content/i), { key: ' ' });
    expect(dialog()).toBeDefined();
  });

  it('closes on window-level Escape and resets the query when reopened', () => {
    renderPalette();
    openPalette();
    fireEvent.change(searchInput(), { target: { value: 'forecast' } });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();

    openPalette();
    expect(searchInput().value).toBe('');
  });

  it('toggles open and closed with Ctrl+K', () => {
    renderPalette();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(dialog()).toBeDefined();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.queryByRole('dialog', { name: /Command Palette/i })).toBeNull();
  });

  it('queries are case-insensitive and trimmed', () => {
    renderPalette();
    openPalette();
    fireEvent.change(searchInput(), { target: { value: '  FORECAST  ' } });
    expect(screen.getByRole('button', { name: /30-Day Outlook/i })).toBeDefined();
    expect(within(dialog()).getByText(/AURA Modules/i)).toBeDefined();
  });

  it('ignores non-Escape keys on the dialog backdrop', () => {
    renderPalette();
    openPalette();
    fireEvent.keyDown(dialog(), { key: 'a' });
    fireEvent.keyDown(dialog(), { key: 'Enter' });
    expect(screen.getByRole('dialog', { name: /Command Palette/i })).toBeDefined();
  });

  it('ignores non-Enter/Space keys inside the panel content', () => {
    renderPalette();
    openPalette();
    const content = screen.getByLabelText(/Command Palette Content/i);
    fireEvent.keyDown(content, { key: 'Tab' });
    fireEvent.keyDown(content, { key: 'ArrowDown' });
    expect(screen.getByRole('dialog', { name: /Command Palette/i })).toBeDefined();
  });
});

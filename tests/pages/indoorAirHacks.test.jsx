import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';
import IndoorAirHacks from '../../src/pages/IndoorAirHacks';

describe('IndoorAirHacks', () => {
  const renderPage = () =>
    render(
      <AppProvider>
        <IndoorAirHacks />
      </AppProvider>
    );

  it('activates a hack and counts it in the household total', () => {
    renderPage();
    // Three hacks start active: Corsi-Rosenthal, weatherstripping, wet mopping.
    expect(screen.getByText(/3 Hacks Active in Your Household/i)).toBeDefined();

    const activateButtons = screen.getAllByText('ACTIVATE');
    fireEvent.click(activateButtons[0]);

    expect(screen.getByText(/4 Hacks Active in Your Household/i)).toBeDefined();
    expect(screen.getAllByText('ACTIVE').length).toBeGreaterThan(0);
  });

  it('expands a collapsed hack to show its blueprint and steps', () => {
    renderPage();
    // Only the Corsi-Rosenthal card starts expanded, and only one card
    // can be expanded at a time — expanding another collapses it.
    expect(screen.getAllByText(/Step-by-Step Construction/i)).toHaveLength(1);

    const card = screen
      .getByText('Damp Microfiber Wet-Mopping (Broom Elimination)')
      .closest('div.panel');
    const expandButton = within(card).getByRole('button', {
      name: /View Blueprint & Instructions/i
    });
    fireEvent.click(expandButton);

    expect(within(card).getByText(/Step-by-Step Construction/i)).toBeDefined();
    expect(within(card).getByText('Hide Blueprint & Steps')).toBeDefined();
    // Still exactly one blueprint open — the newly expanded one.
    expect(screen.getAllByText(/Step-by-Step Construction/i)).toHaveLength(1);
  });
});

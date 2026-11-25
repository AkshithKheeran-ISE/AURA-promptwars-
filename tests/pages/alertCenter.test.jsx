import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';
import AlertCenter from '../../src/pages/AlertCenter';

describe('AlertCenter', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  const renderCenter = () =>
    render(
      <AppProvider>
        <AlertCenter />
      </AppProvider>
    );

  it('renders the queue with all 5 alerts and the first alert selected', () => {
    renderCenter();
    expect(screen.getByText(/Air Quality Alert & Incident Center/i)).toBeDefined();
    expect(screen.getByText(/5 Queued/i)).toBeDefined();
    expect(screen.getByText(/2 Critical Incidents/i)).toBeDefined();
    // The selected alert id appears in both the queue button and the dossier header
    expect(screen.getAllByText(/ALR-DEL-901/i).length).toBe(2);
  });

  it('filters the queue by severity', () => {
    renderCenter();
    fireEvent.click(screen.getByRole('button', { name: /critical \(2\)/i }));
    expect(screen.getByText(/2 Queued/i)).toBeDefined();
    expect(screen.queryByText(/ALR-DEL-887/i)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /high \(2\)/i }));
    expect(screen.getByText(/2 Queued/i)).toBeDefined();
    expect(screen.getByText(/ALR-DEL-887/i)).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /medium \(1\)/i }));
    expect(screen.getByText(/1 Queued/i)).toBeDefined();
    expect(screen.getByText(/ALR-DEL-865/i)).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /all \(5\)/i }));
    expect(screen.getByText(/5 Queued/i)).toBeDefined();
  });

  it('selects a different alert and shows its dossier', () => {
    renderCenter();
    const queue = screen.getByText(/Active Incident Queue/i).closest('div').parentElement;
    const alertBtn = within(queue).getByRole('button', { name: /ALR-DEL-887/i });
    fireEvent.click(alertBtn);
    // The selected alert id appears in both the queue button and the dossier header
    expect(screen.getAllByText(/ALR-DEL-887/i).length).toBe(2);
    // Detail dossier shows the selected alert's source/exceedance
    expect(screen.getByText(/Source Attribution:/i)).toBeDefined();
  });

  it('executes a playbook action and marks it done', () => {
    renderCenter();
    const actionBtn = screen.getByRole('button', { name: /Dispatch Anti-Smog Water Cannons/i });
    // No jest-dom matchers in this repo: assert the disabled property directly
    expect(actionBtn.disabled).toBe(false);
    fireEvent.click(actionBtn);
    expect(actionBtn.disabled).toBe(true);
    // The executed action appears both as the done playbook button and in the
    // "Current Playbook State" bar
    expect(screen.getAllByText(/Dispatch Anti-Smog Water Cannons/i).length).toBe(2);
    expect(screen.getByText(/Current Playbook State:/i)).toBeDefined();
  });

  it('boosts a medium alert to critical and caps the score at 10', () => {
    renderCenter();
    // Select the medium alert first (keeps the full queue visible after the boost)
    fireEvent.click(screen.getByRole('button', { name: /ALR-DEL-865/i }));
    expect(screen.getByText(/AURA Score: 6.8\/10/i)).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /Boost Alert Priority/i }));
    // Score rises by 0.5 and severity flips to critical (2 existing + 1 boosted)
    expect(screen.getByText(/AURA Score: 7.3\/10/i)).toBeDefined();
    expect(screen.getByText(/3 Critical Incidents/i)).toBeDefined();
  });

  it('caps a near-max score at 10 when boosting', () => {
    renderCenter();
    fireEvent.click(screen.getByRole('button', { name: /Boost Alert Priority/i }));
    expect(screen.getByText(/AURA Score: 10\/10/i)).toBeDefined();
  });
});

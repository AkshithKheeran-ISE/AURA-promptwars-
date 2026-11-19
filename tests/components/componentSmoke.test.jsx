import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';
import CitizenReports from '../../src/pages/CitizenReports';
import CommandCenter from '../../src/pages/CommandCenter';
import AgentSystem from '../../src/pages/AgentSystem';

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

    // Verify main section header rendered
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();

    // Verify simulate tamper button is present and click it
    const tamperBtn = screen.getByRole('button', { name: /Simulate Tamper/i });
    expect(tamperBtn).toBeDefined();

    fireEvent.click(tamperBtn);

    // Assert that the tamper alert banner appears in the document
    await waitFor(() => {
      expect(screen.getByText(/SECURITY ALERT: Cryptographic Chain Broken!/i)).toBeDefined();
    });

    // Verify that clicking Run Zero-Data-Loss Repair Engine restores the ledger
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

    // Verify provenance and simulation indicators are visible
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

    // Verify GenAI terminal heading is present
    expect(screen.getByText(/GenAI Smog Assistant Terminal/i)).toBeDefined();
  });
});

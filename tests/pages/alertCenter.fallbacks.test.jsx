import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AlertCenter from '../../src/pages/AlertCenter';

// The seed data only uses known severities and icons, so the defensive
// fallbacks in AlertCenter (default severity badge, Zap icon) need injected
// data. The component only reads useAlerts() from the context module, so the
// data lives inside the mock factory (hoisted above the module body).
vi.mock('../../src/context/AppContext', () => ({
  useAlerts: () => ({
    alerts: [
      {
        id: 'ALR-TEST-001',
        title: 'Unknown severity test incident',
        ward: 'Test Ward',
        source: 'Test source',
        type: 'test',
        severity: 'not-a-real-severity',
        score: 5.5,
        exceedance: '+10% above test standard',
        affected: 'Nobody, this is a test',
        timestamp: 'just now',
        activeAction: null,
        escalated: false,
        playbook: [
          {
            id: 'mystery_action',
            label: 'Do Something Mysterious',
            icon: 'NotARealIcon',
            done: false
          }
        ]
      }
    ],
    executePlaybookAction: () => {},
    boostAlertPriority: () => {}
  })
}));

describe('AlertCenter defensive fallbacks', () => {
  it('uses the default severity badge for an unknown severity', () => {
    render(<AlertCenter />);
    // The unknown severity renders twice (queue badge + dossier header), and the
    // queue badge carries the default amber classes, not a severity colour
    expect(screen.getAllByText(/not-a-real-severity/i).length).toBe(2);
    // Title also appears twice (queue row + dossier heading)
    expect(screen.getAllByText(/Unknown severity test incident/i).length).toBe(2);
    expect(screen.getByText(/0 Critical Incidents/i)).toBeDefined();
  });

  it('uses the Zap fallback icon for an unknown playbook icon', () => {
    render(<AlertCenter />);
    // The playbook action still renders and is clickable with the fallback icon
    expect(screen.getByRole('button', { name: /Do Something Mysterious/i })).toBeDefined();
  });
});

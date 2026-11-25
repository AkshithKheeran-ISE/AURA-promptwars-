import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';
import AuditTrail from '../../src/pages/AuditTrail';

// Force every stored hash to fail recomputation, so the table shows MISMATCH.
vi.mock('../../src/data/telemetry', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, computeAuditHash: () => '0'.repeat(64) };
});

describe('AuditTrail hash mismatch', () => {
  it('shows MISMATCH badges when a log hash does not recompute', () => {
    render(
      <AppProvider>
        <AuditTrail />
      </AppProvider>
    );
    // Exact badge text: "Showing N verified records" also contains "verified"
    expect(screen.getAllByText('MISMATCH').length).toBeGreaterThan(0);
    expect(screen.queryByText('VERIFIED')).toBeNull();
  });
});

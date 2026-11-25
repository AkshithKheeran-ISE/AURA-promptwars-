import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useUi } from '../../src/context/AppContext';
import AuditTrail from '../../src/pages/AuditTrail';

// The seed logs only use human/agent/system types, so the type-count else
// branch needs a log with an unknown type. logAudit() accepts an arbitrary
// type, so it can be injected through the real context — no mocking needed.
function MysteryLogButton() {
  const { logAudit } = useUi();
  return (
    <button
      type="button"
      onClick={() =>
        logAudit('Mystery Actor', 'Test mystery action', 'Test Target', 'mystery-type')
      }
    >
      Add mystery log
    </button>
  );
}

describe('AuditTrail defensive fallbacks', () => {
  it('ignores an unknown log type in the stat counts', () => {
    render(
      <AppProvider>
        <MysteryLogButton />
        <AuditTrail />
      </AppProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Add mystery log/i }));
    // 10 seed logs + 1 mystery log; the mystery type counts toward no bucket
    expect(screen.getByText(/Showing 11 verified records/i)).toBeDefined();
    expect(screen.getByText(/Test mystery action/i)).toBeDefined();
  });
});

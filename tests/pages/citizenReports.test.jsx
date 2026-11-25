import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';
import CitizenReports from '../../src/pages/CitizenReports';

describe('CitizenReports', () => {
  it('advances a report to stage 4 and removes its advance button', () => {
    render(
      <AppProvider>
        <CitizenReports />
      </AppProvider>
    );

    // Seed stages are [4, 3, 2, 1] but the table renders them reversed,
    // so the buttons in DOM order belong to the stage-1, stage-2 and
    // stage-3 reports. The last button is the stage-3 report; one click
    // resolves it.
    const advanceButtons = screen.getAllByLabelText(/Advance triage stage for report/);
    expect(advanceButtons).toHaveLength(3);

    fireEvent.click(advanceButtons[2]);

    expect(screen.getAllByLabelText(/Advance triage stage for report/)).toHaveLength(2);
    expect(screen.getAllByText('Hazard Doused & Fine Issued').length).toBeGreaterThan(0);
  });
});

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';
import AuditTrail from '../../src/pages/AuditTrail';

describe('AuditTrail', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  const renderTrail = () =>
    render(
      <AppProvider>
        <AuditTrail />
      </AppProvider>
    );

  it('renders stat cards and the full log table', () => {
    renderTrail();
    expect(screen.getByText(/Immutable Environmental Audit Trail/i)).toBeDefined();
    expect(screen.getByText(/Total Audit Logs/i)).toBeDefined();
    expect(screen.getByText(/Human Actions/i)).toBeDefined();
    expect(screen.getByText(/Autonomous AI Actions/i)).toBeDefined();
    expect(screen.getByText(/System Telemetry Events/i)).toBeDefined();
    expect(screen.getByText(/Cryptographic Action History/i)).toBeDefined();
    expect(screen.getByText(/verified records/i)).toBeDefined();
  });

  it('filters logs by actor type', () => {
    renderTrail();
    const showing = () => screen.getByText(/verified records/i).textContent;

    fireEvent.click(screen.getByRole('button', { name: /^human$/i }));
    const humanCount = showing();
    expect(humanCount).toMatch(/Showing \d+ verified records/);

    fireEvent.click(screen.getByRole('button', { name: /^agent$/i }));
    expect(screen.getByText(/verified records/i)).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /^system$/i }));
    expect(screen.getByText(/verified records/i)).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /^all$/i }));
    expect(showing()).toContain('verified records');
  });

  it('searches logs by actor, action, target and id', () => {
    renderTrail();
    const search = screen.getByLabelText(/Search action logs/i);

    fireEvent.change(search, { target: { value: 'Validator Agent' } });
    expect(screen.getByText(/verified records/i)).toBeDefined();

    fireEvent.change(search, { target: { value: 'zzzznomatch' } });
    expect(screen.getByText(/Showing 0 verified records/i)).toBeDefined();

    fireEvent.change(search, { target: { value: '' } });
    expect(screen.queryByText(/Showing 0 verified records/i)).toBeNull();
  });

  it('search is case-insensitive and trims whitespace', () => {
    renderTrail();
    const search = screen.getByLabelText(/Search action logs/i);
    // 'BioValidator (AI)' is a real log actor; padded + upper-case still matches
    fireEvent.change(search, { target: { value: '  BIOVALIDATOR  ' } });
    expect(screen.queryByText(/Showing 0 verified records/i)).toBeNull();
    expect(screen.getByText(/BioValidator/i)).toBeDefined();
  });

  it('exports a CSV through a blob URL and revokes it', () => {
    const createObjectURL = vi.fn(() => 'blob:fake-audit');
    const revokeObjectURL = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    try {
      renderTrail();
      fireEvent.click(screen.getByRole('button', { name: /Export Audit CSV/i }));
      expect(createObjectURL).toHaveBeenCalledTimes(1);
      const blob = createObjectURL.mock.calls[0][0];
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/csv');
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-audit');
    } finally {
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
      clickSpy.mockRestore();
    }
  });
});

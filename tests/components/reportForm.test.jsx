import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportForm from '../../src/components/reports/ReportForm';

describe('ReportForm', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  const renderForm = (props = {}) =>
    render(
      <ReportForm
        onSubmitReport={props.onSubmitReport || vi.fn()}
        merkleRootHex={props.merkleRootHex || 'a'.repeat(64)}
      />
    );

  it('renders the form with defaults and truncated merkle root', () => {
    renderForm();
    expect(screen.getByText(/Cryptographic Citizen Report/i)).toBeDefined();
    expect(screen.getByLabelText(/Select ward location/i)).toBeDefined();
    expect(screen.getByLabelText(/Select hazard category/i)).toBeDefined();
    expect(screen.getByLabelText(/Select report urgency/i)).toBeDefined();
    expect(screen.getByText(/Merkle Root: 0xaaaaaaaaaaaaaaaa\.\.\./i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign & Hash to Immutable Ledger/i })).toBeDefined();
  });

  it('submits a complete report and resets the form', () => {
    const onSubmitReport = vi.fn();
    renderForm({ onSubmitReport });

    fireEvent.change(screen.getByLabelText(/Select ward location/i), {
      target: { value: 'Anand Vihar Transit Terminal' }
    });
    fireEvent.change(screen.getByLabelText(/Select hazard category/i), {
      target: { value: 'Noxious Chemical / Acidic Odor' }
    });
    fireEvent.change(screen.getByLabelText(/Reporter Name\/Role:/i), {
      target: { value: 'RWA Secretary' }
    });
    fireEvent.change(screen.getByLabelText(/Select report urgency/i), {
      target: { value: 'Critical' }
    });
    fireEvent.change(screen.getByLabelText(/Observations & Specifics:/i), {
      target: { value: 'Thick acid fumes near the underpass' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign & Hash to Immutable Ledger/i }));

    expect(onSubmitReport).toHaveBeenCalledTimes(1);
    expect(onSubmitReport).toHaveBeenCalledWith({
      location: 'Anand Vihar Transit Terminal',
      issue: 'Noxious Chemical / Acidic Odor — Thick acid fumes near the underpass',
      reporter: 'RWA Secretary',
      urgency: 'Critical'
    });

    // Form resets to defaults after submit
    expect(screen.getByLabelText(/Reporter Name\/Role:/i).value).toBe('');
    expect(screen.getByLabelText(/Observations & Specifics:/i).value).toBe('');
  });

  it('defaults reporter to Anonymous Resident when left blank', () => {
    const onSubmitReport = vi.fn();
    renderForm({ onSubmitReport });

    fireEvent.change(screen.getByLabelText(/Observations & Specifics:/i), {
      target: { value: 'Garbage burning behind the market' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign & Hash to Immutable Ledger/i }));

    expect(onSubmitReport).toHaveBeenCalledWith(
      expect.objectContaining({ reporter: 'Anonymous Resident' })
    );
  });

  it('does not submit when the description is empty or whitespace only', () => {
    const onSubmitReport = vi.fn();
    renderForm({ onSubmitReport });

    fireEvent.click(screen.getByRole('button', { name: /Sign & Hash to Immutable Ledger/i }));
    expect(onSubmitReport).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Observations & Specifics:/i), {
      target: { value: '   ' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign & Hash to Immutable Ledger/i }));
    expect(onSubmitReport).not.toHaveBeenCalled();
  });

  it('updates every field through its onChange handler', () => {
    renderForm();
    const urgency = screen.getByLabelText(/Select report urgency/i);
    fireEvent.change(urgency, { target: { value: 'Low' } });
    expect(urgency.value).toBe('Low');

    const category = screen.getByLabelText(/Select hazard category/i);
    fireEvent.change(category, { target: { value: 'Illegal High-Capacity Diesel Genset' } });
    expect(category.value).toBe('Illegal High-Capacity Diesel Genset');
  });
});

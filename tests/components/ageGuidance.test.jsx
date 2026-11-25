/**
 * AgeGuidance component: usable by every user — age buttons are real
 * buttons with pressed state, the condition toggle is a labelled
 * checkbox, and the result is announced in a polite live region.
 * Advice changes when the user picks a different age group, driven by
 * the live snapshot passed in.
 * (Repo convention: plain Vitest assertions, no jest-dom matchers.)
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AgeGuidance from '../../src/components/live/AgeGuidance';

const snapshot = { pm25: 40, usAqi: 112 };

describe('AgeGuidance component', () => {
  it('defaults to healthy adults and shows their advice', () => {
    render(<AgeGuidance snapshot={snapshot} />);
    expect(screen.getByText(/Caution for this age group/)).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Healthy adults/ }).getAttribute('aria-pressed')
    ).toBe('true');
  });

  it('switching to schoolchildren makes the advice one step stricter for the same reading', () => {
    render(<AgeGuidance snapshot={snapshot} />);
    fireEvent.click(screen.getByRole('button', { name: /Schoolchildren/ }));
    expect(screen.getByText(/Reduce outdoor time/)).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Schoolchildren/ }).getAttribute('aria-pressed')
    ).toBe('true');
    expect(
      screen.getByRole('button', { name: /Healthy adults/ }).getAttribute('aria-pressed')
    ).toBe('false');
  });

  it('switching to teenagers makes the advice one step stricter for the same reading', () => {
    render(<AgeGuidance snapshot={snapshot} />);
    fireEvent.click(screen.getByRole('button', { name: /Teenagers/ }));
    expect(screen.getByText(/Reduce outdoor time/)).toBeDefined();
    expect(screen.getByRole('button', { name: /Teenagers/ }).getAttribute('aria-pressed')).toBe(
      'true'
    );
  });

  it('the pregnancy checkbox makes an adult stricter without changing age', () => {
    render(<AgeGuidance snapshot={snapshot} />);
    fireEvent.click(screen.getByLabelText(/Pregnant/));
    expect(screen.getByText(/Reduce outdoor time/)).toBeDefined();
  });

  it('labels outdoor-time minutes as AURA guidance and covers outdoor workers', () => {
    render(<AgeGuidance snapshot={snapshot} />);
    expect(screen.getByText(/Outdoor-time minutes are AURA guidance/)).toBeDefined();
    expect(screen.getByText(/Outdoor workers/)).toBeDefined();
  });

  it('the condition checkbox makes an adult stricter without changing age', () => {
    render(<AgeGuidance snapshot={snapshot} />);
    fireEvent.click(screen.getByLabelText(/Asthma, heart or lung condition/));
    expect(screen.getByText(/Reduce outdoor time/)).toBeDefined();
  });

  it('shows outdoor-time and mask advice and the not-medical-advice note', () => {
    render(<AgeGuidance snapshot={snapshot} />);
    expect(screen.getByText(/Outdoor time/)).toBeDefined();
    expect(screen.getByText(/Mask/)).toBeDefined();
    expect(screen.getByText(/Guidance, not medical advice/)).toBeDefined();
    expect(screen.getByText(/WHO 2021 PM2\.5 target/)).toBeDefined();
  });

  it('renders nothing when there is no live PM2.5 to base advice on', () => {
    const { container } = render(<AgeGuidance snapshot={{}} />);
    expect(container.innerHTML).toBe('');
  });

  it('announces the result in a polite live region', () => {
    render(<AgeGuidance snapshot={snapshot} />);
    const region = screen.getByText(/Caution for this age group/).closest('[aria-live]');
    expect(region).toBeDefined();
    expect(region.getAttribute('aria-live')).toBe('polite');
  });
});

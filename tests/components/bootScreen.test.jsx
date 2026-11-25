import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BootScreen from '../../src/components/BootScreen';

// Each 220ms step is scheduled by a passive effect, so the effect must flush
// between steps: advance one step per act() call.
const advanceBootSteps = (n) => {
  for (let i = 0; i < n; i++) {
    act(() => {
      vi.advanceTimersByTime(220);
    });
  }
};

describe('BootScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows no logs at first, then progresses through the sequence', () => {
    const onDone = vi.fn();
    render(<BootScreen onDone={onDone} />);

    expect(screen.getByRole('heading', { level: 1, name: /AURA/i })).toBeDefined();
    // step starts at 0, so slice(0, 0) renders no log lines yet
    expect(screen.queryByText(/AURA CLIENT RUNTIME/i)).toBeNull();
    expect(screen.queryByText(/ACCESS GRANTED/i)).toBeNull();

    advanceBootSteps(1);
    expect(screen.getByText(/AURA CLIENT RUNTIME/i)).toBeDefined();

    advanceBootSteps(7);
    expect(screen.getByText(/Verifying immutable citizen community ledger/i)).toBeDefined();
    expect(screen.getByText(/ACCESS GRANTED · SYSTEM LIVE/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Enter Command Center/i })).toBeDefined();
  });

  it('renders OK badges for completed lines and strips OK from the log text', () => {
    render(<BootScreen onDone={vi.fn()} />);
    advanceBootSteps(3);
    // Logs 2 and 3 end with OK and each gets a separate OK badge span
    expect(screen.getAllByText(/OK/).length).toBe(2);
    expect(screen.getByText(/Initializing Web Crypto SHA-256 integrity engine/i)).toBeDefined();
  });

  it('calls onDone when Enter Command Center is clicked after boot completes', () => {
    const onDone = vi.fn();
    render(<BootScreen onDone={onDone} />);
    advanceBootSteps(8);
    fireEvent.click(screen.getByRole('button', { name: /Enter Command Center/i }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('calls onDone immediately via Skip Boot Sequence', () => {
    const onDone = vi.fn();
    render(<BootScreen onDone={onDone} />);
    fireEvent.click(screen.getByRole('button', { name: /Skip Boot Sequence/i }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('stops advancing once boot is done', () => {
    render(<BootScreen onDone={vi.fn()} />);
    advanceBootSteps(8);
    expect(screen.getByText(/ACCESS GRANTED · SYSTEM LIVE/i)).toBeDefined();
    advanceBootSteps(20);
    expect(screen.getByText(/ACCESS GRANTED · SYSTEM LIVE/i)).toBeDefined();
    // Still exactly 8 log lines (the first has no OK badge, the other 7 do)
    expect(screen.getAllByText(/OK/).length).toBe(7);
  });
});

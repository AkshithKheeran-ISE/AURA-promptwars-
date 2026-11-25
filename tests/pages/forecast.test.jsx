import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Forecast from '../../src/pages/Forecast';

describe('Forecast', () => {
  it('selects a day when its calendar card is clicked', () => {
    render(<Forecast />);

    const day5 = screen.getByRole('button', { name: /DAY 5/i });
    expect(day5.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(day5);
    expect(day5.getAttribute('aria-pressed')).toBe('true');
  });
});

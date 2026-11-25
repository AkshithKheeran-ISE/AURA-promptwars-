import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNavigationState } from '../../src/hooks/useNavigationState';

const TEST_NAV_ITEMS = [
  { id: 'command', label: 'Command Center' },
  { id: 'routines', label: 'Routines' },
  { id: 'alerts', label: 'Alerts' }
];

describe('useNavigationState hook', () => {
  it('initializes to default page and toggles sidebar/command palette', () => {
    window.location.hash = '';
    window.scrollTo = vi.fn();

    const { result } = renderHook(() => useNavigationState(TEST_NAV_ITEMS));
    expect(result.current.page).toBe('command');
    expect(result.current.sidebarCollapsed).toBe(false);
    expect(result.current.commandPaletteOpen).toBe(false);

    act(() => {
      result.current.setSidebarCollapsed(true);
      result.current.setCommandPaletteOpen(true);
    });

    expect(result.current.sidebarCollapsed).toBe(true);
    expect(result.current.commandPaletteOpen).toBe(true);
  });

  it('updates route and hash on setPage', () => {
    window.scrollTo = vi.fn();
    const { result } = renderHook(() => useNavigationState(TEST_NAV_ITEMS));

    act(() => {
      result.current.setPage('routines');
    });

    expect(result.current.page).toBe('routines');
    expect(window.location.hash).toBe('#/routines');
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('initializes from a matching hash', () => {
    window.location.hash = '#/routines';
    window.scrollTo = vi.fn();
    const { result } = renderHook(() => useNavigationState(TEST_NAV_ITEMS));
    expect(result.current.page).toBe('routines');
  });

  it('falls back to the default page when the nav items are unusable', () => {
    window.location.hash = '#/routines';
    const { result } = renderHook(() => useNavigationState(null));
    expect(result.current.page).toBe('command');
  });

  it('toggles command palette on Ctrl+K hotkey', () => {
    const { result } = renderHook(() => useNavigationState(TEST_NAV_ITEMS));
    expect(result.current.commandPaletteOpen).toBe(false);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });

    expect(result.current.commandPaletteOpen).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });

    expect(result.current.commandPaletteOpen).toBe(false);
  });
});

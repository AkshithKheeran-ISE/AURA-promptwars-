import { describe, it, expect } from 'vitest';
import { NAV_ITEMS } from '../src/context/AppContext';

describe('Navigation & Modular Routing', () => {
  it('contains exactly 10 core modules matching the command architecture', () => {
    expect(NAV_ITEMS.length).toBe(10);
    const ids = NAV_ITEMS.map(item => item.id);
    expect(ids).toEqual([
      'command',
      'routines',
      'hacks',
      'alternatives',
      'map',
      'alerts',
      'reports',
      'ai',
      'forecast',
      'audit'
    ]);
  });

  it('every navigation item has a valid human-readable label and icon', () => {
    NAV_ITEMS.forEach(item => {
      expect(item.label.length).toBeGreaterThan(2);
      expect(item.icon).toBeTruthy();
    });
  });

  it('includes specialized badges for smart routines, DIY hacks, and AI assistant', () => {
    const routinesItem = NAV_ITEMS.find(i => i.id === 'routines');
    const hacksItem = NAV_ITEMS.find(i => i.id === 'hacks');
    const aiItem = NAV_ITEMS.find(i => i.id === 'ai');

    expect(routinesItem.badge).toBe('SMART');
    expect(hacksItem.badge).toBe('DIY');
    expect(aiItem.badge).toBe('AI');
  });
});

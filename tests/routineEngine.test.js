import { describe, it, expect } from 'vitest';
import {
  FAMILY_ARCHETYPES,
  DAILY_ROUTINE_SLOTS,
  generatePersonalizedGuidance
} from '../src/services/routineEngine';

describe('Routine Engine Service', () => {
  it('contains all 4 family archetypes with tailored vulnerabilities', () => {
    expect(FAMILY_ARCHETYPES.length).toBe(4);
    const infantFamily = FAMILY_ARCHETYPES.find((a) => a.id === 'school_infant');
    expect(infantFamily).toBeDefined();
    expect(infantFamily.vulnerabilities.length).toBeGreaterThan(0);
  });

  it('contains comprehensive daily time slots with diurnal inversion details', () => {
    expect(DAILY_ROUTINE_SLOTS.length).toBe(5);
    const morningSlot = DAILY_ROUTINE_SLOTS[0];
    expect(morningSlot.timeSlot).toContain('06:30');
    expect(morningSlot.inversionHeight).toContain('80m');
    expect(morningSlot.actionBadge).toBe('STRICT WINDOW SEAL');
  });

  it('generates personalized guidance matching severe smog emergencies', () => {
    const infantAdvice = generatePersonalizedGuidance('school_infant', 350);
    expect(infantAdvice.title).toContain('Pediatric Defense Protocol');
    expect(infantAdvice.keyRule).toContain('N95 respirator mandatory');

    const seniorAdvice = generatePersonalizedGuidance('asthma_seniors', 280);
    expect(seniorAdvice.title).toContain('Senior Bronchial Shield Protocol');
    expect(seniorAdvice.keyRule).toContain('morning balcony walks');

    const defaultAdvice = generatePersonalizedGuidance('unknown_archetype', 150);
    expect(defaultAdvice.title).toContain('Community Clean Commute Protocol');
    expect(defaultAdvice.keyRule).toContain('Metro / electric carpool');
  });
});

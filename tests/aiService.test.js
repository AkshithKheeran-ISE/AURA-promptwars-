import { describe, it, expect } from 'vitest';
import { queryAiAssistant, getAiServiceStatus } from '../src/services/aiService';

describe('AURA GenAI & Multi-Agent Service', () => {
  it('returns valid AI service configuration status', () => {
    const status = getAiServiceStatus();
    expect(status).toHaveProperty('isLiveConfigured');
    expect(status).toHaveProperty('engineName');
    expect(status).toHaveProperty('provider');
    expect(typeof status.isLiveConfigured).toBe('boolean');
  });

  it('routes DIY filter queries to IAQEngineer with CADR specs', async () => {
    const res = await queryAiAssistant('How do I build a DIY Corsi Rosenthal box?');
    expect(res.agent).toBe('IAQEngineer');
    expect(res.text).toContain('CORSI-ROSENTHAL');
    expect(res.text).toContain('MERV-13');
    expect(res.text).toContain('₹1,450');
  });

  it('routes child vulnerability queries to PediatricShield with clinical protocol', async () => {
    const res = await queryAiAssistant('What protection protocol for infant and asthmatic senior?');
    expect(res.agent).toBe('PediatricShield');
    expect(res.text).toContain('INFANTS');
    expect(res.text).toContain('wet-mop');
    expect(res.text).toContain('AIIMS');
  });

  it('routes window ventilation queries to MeteoForecaster with diurnal inversion window', async () => {
    const res = await queryAiAssistant(
      'When should I open my window for cross ventilation inversion?'
    );
    expect(res.agent).toBe('MeteoForecaster');
    expect(res.text).toContain('13:30 and 15:30');
    expect(res.text).toContain('INVERSION');
  });

  it('routes commute queries to FamilyAdvisor with quantified carbon savings', async () => {
    const res = await queryAiAssistant('Taking metro transit vs car commute emissions');
    expect(res.agent).toBe('FamilyAdvisor');
    expect(res.text).toContain('COMMUTE');
    expect(res.text).toContain('CO2');
  });

  it('routes heating questions to EcoAuditor with clean radiator alternative', async () => {
    const res = await queryAiAssistant('Why is coal sigdi heating dangerous?');
    expect(res.agent).toBe('EcoAuditor');
    expect(res.text).toContain('HEATING');
    expect(res.text).toContain('radiator');
  });

  it('handles empty query gracefully with guidance prompt', async () => {
    const res = await queryAiAssistant('');
    expect(res.badge).toBe('INPUT REQUIRED');
    expect(res.agent).toBe('AURA-CORE');
  });
});

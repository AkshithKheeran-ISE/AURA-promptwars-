import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  resolveAgentIntent,
  orchestrateAgentWorkflow,
  orchestrateMultiAgentConsensus,
  queryAiAssistant,
  getAiServiceStatus
} from '../src/services/aiService';

const makeProxyResponse = (payload, ok = true) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(payload)
  });

describe('aiService branch coverage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('resolveAgentIntent', () => {
    it('returns the preferred agent when it exists', () => {
      expect(resolveAgentIntent('hello', 'eco_auditor')).toBe('eco_auditor');
    });

    it('ignores an unknown preferred agent id and falls back to keyword matching', () => {
      expect(resolveAgentIntent('my child coughs at night', 'no-such-agent')).toBe(
        'pediatric_shield'
      );
    });

    it('matches indoor-air engineer keywords', () => {
      expect(resolveAgentIntent('should I buy a HEPA purifier?')).toBe('iaq_engineer');
    });

    it('matches weather/forecast keywords', () => {
      expect(resolveAgentIntent('what is the weather forecast for tomorrow?')).toBe(
        'meteo_forecaster'
      );
    });

    it('matches eco auditor keywords', () => {
      expect(resolveAgentIntent('how can I cut my carbon emissions?')).toBe('eco_auditor');
    });

    it('matches community watch keywords', () => {
      expect(resolveAgentIntent('report a smog burning violation in my colony')).toBe(
        'community_watch'
      );
    });

    it('falls back to the family advisor for an unmatched or empty prompt', () => {
      expect(resolveAgentIntent('hello there')).toBe('family_advisor');
      expect(resolveAgentIntent('')).toBe('family_advisor');
      expect(resolveAgentIntent(null)).toBe('family_advisor');
    });
  });

  describe('deterministic agent renders', () => {
    it('renders the meteo forecaster golden window at 14:00', async () => {
      vi.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const res = await orchestrateAgentWorkflow('what is the weather forecast?');
      expect(res.agentId).toBe('meteo_forecaster');
      expect(res.text).toContain('480m');
      expect(res.text).toContain('GOLDEN WINDOW ACTIVE');
    });

    it('renders the meteo forecaster inversion trap outside the window', async () => {
      vi.spyOn(Date.prototype, 'getHours').mockReturnValue(9);
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const res = await orchestrateAgentWorkflow('what is the weather forecast?');
      expect(res.text).toContain('85m');
      expect(res.text).toContain('SURFACE INVERSION TRAP ACTIVE');
    });

    it('uses the 480m ceiling at the window boundary hours 12 and 16', async () => {
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      vi.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
      const noon = await orchestrateAgentWorkflow('weather forecast please');
      expect(noon.text).toContain('480m');
      expect(noon.text).toContain('SURFACE INVERSION TRAP ACTIVE');

      vi.spyOn(Date.prototype, 'getHours').mockReturnValue(16);
      const late = await orchestrateAgentWorkflow('weather forecast please');
      expect(late.text).toContain('480m');
    });

    it('uses the 85m ceiling at 11:00', async () => {
      vi.spyOn(Date.prototype, 'getHours').mockReturnValue(11);
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const res = await orchestrateAgentWorkflow('weather forecast please');
      expect(res.text).toContain('85m');
    });

    it('renders the family advisor for each archetype branch', async () => {
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const infant = await orchestrateAgentWorkflow('hello there');
      expect(infant.agentId).toBe('family_advisor');
      expect(infant.text).toContain('Infant & School Children');

      const senior = await orchestrateAgentWorkflow('hello there', {
        familyArchetype: 'asthma_seniors'
      });
      expect(senior.text).toContain('Elderly Asthmatic');

      const commuter = await orchestrateAgentWorkflow('hello there', {
        familyArchetype: 'daily_commuter'
      });
      expect(commuter.text).toContain('Active Commuters');
    });

    it('renders the pediatric shield with ambient PM2.5 from context', async () => {
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const custom = await orchestrateAgentWorkflow('my child has asthma', {
        ambientPm25: 500
      });
      expect(custom.agentId).toBe('pediatric_shield');
      expect(custom.text).toContain('500 µg/m³');

      const fallback = await orchestrateAgentWorkflow('my child has asthma');
      expect(fallback.text).toContain('280 µg/m³');
    });

    it('renders the IAQ engineer with the room area from context', async () => {
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const res = await orchestrateAgentWorkflow('DIY Corsi box filter specs', {
        areaSqFt: 400
      });
      expect(res.agentId).toBe('iaq_engineer');
      expect(res.text).toContain('400 sq ft');
    });

    it('renders the eco auditor with the commute distance from context', async () => {
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const res = await orchestrateAgentWorkflow('how can I cut carbon emissions?', {
        distanceKm: 10
      });
      expect(res.agentId).toBe('eco_auditor');
      expect(res.text).toContain('₹56/day');
    });

    it('attaches a trace and a SHA-256 attestation token', async () => {
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const res = await orchestrateAgentWorkflow('my child coughs at night');
      expect(res.attestationToken).toMatch(/^[0-9a-f]{64}$/);
      expect(res.trace.some((t) => t.step === 'ATTESTATION_GENERATION')).toBe(true);
      expect(res.durationMs).toBeGreaterThanOrEqual(0);
      expect(res.timestamp).toBeGreaterThan(0);
    });
  });

  describe('live proxy paths', () => {
    it('uses the live proxy when it returns a success payload', async () => {
      globalThis.fetch.mockImplementation(() =>
        makeProxyResponse({
          success: true,
          text: 'Live answer from Gemini',
          model: 'gemini-2.0-flash',
          latencyMs: 123
        })
      );
      const res = await orchestrateAgentWorkflow('what is the weather forecast?');
      expect(res.agentId).toBe('meteo_forecaster');
      expect(res.text).toContain('Live answer from Gemini');
      expect(res.engine).toContain('Gemini 2.0 Flash');
      expect(res.isFallback).toBe(false);
      expect(res.executionMode).toBe('LIVE_PROXY');
    });

    it('falls back to the deterministic agent when the proxy is not ok', async () => {
      globalThis.fetch.mockImplementation(() => makeProxyResponse({ success: false }, false));
      const res = await orchestrateAgentWorkflow('my child coughs at night');
      expect(res.agentId).toBe('pediatric_shield');
      expect(res.isFallback).toBe(true);
      expect(res.executionMode).toBe('DETERMINISTIC_SPECIALIST');
      expect(res.text).toContain('PediatricShield');
    });

    it('falls back when the proxy returns success:false', async () => {
      globalThis.fetch.mockImplementation(() =>
        makeProxyResponse({ success: false, text: 'nope' })
      );
      const res = await orchestrateAgentWorkflow('my child coughs at night');
      expect(res.isFallback).toBe(true);
    });

    it('falls back when the proxy returns a non-string text field', async () => {
      globalThis.fetch.mockImplementation(() => makeProxyResponse({ success: true, text: 42 }));
      const res = await orchestrateAgentWorkflow('my child coughs at night');
      expect(res.isFallback).toBe(true);
    });

    it('falls back when the proxy returns an empty text field', async () => {
      globalThis.fetch.mockImplementation(() => makeProxyResponse({ success: true, text: '' }));
      const res = await orchestrateAgentWorkflow('my child coughs at night');
      expect(res.isFallback).toBe(true);
    });

    it('falls back when fetch throws (network offline)', async () => {
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const res = await orchestrateAgentWorkflow('my child coughs at night');
      expect(res.isFallback).toBe(true);
      expect(res.text).toContain('PediatricShield');
    });

    it('aborts the proxy request after the configured timeout', async () => {
      // The proxy call sets a 7500ms abort timer; with fake timers we can fire
      // it while the fetch is still pending and watch the fallback engage.
      vi.useFakeTimers();
      try {
        globalThis.fetch.mockImplementation(
          (_url, opts) =>
            new Promise((_resolve, reject) => {
              opts.signal.addEventListener('abort', () =>
                reject(new DOMException('The operation was aborted.', 'AbortError'))
              );
            })
        );
        const pending = orchestrateAgentWorkflow('my child coughs at night');
        // Flush the microtasks so the fetch is issued before advancing time
        await Promise.resolve();
        await vi.advanceTimersByTimeAsync(7500);
        const res = await pending;
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
        expect(res.isFallback).toBe(true);
        expect(res.executionMode).toBe('DETERMINISTIC_SPECIALIST');
        expect(res.text).toContain('PediatricShield');
      } finally {
        vi.useRealTimers();
      }
    });

    it('does not call the live proxy for short prompts or a preferred agent', async () => {
      globalThis.fetch.mockImplementation(() => makeProxyResponse({ success: true, text: 'live' }));

      const short = await orchestrateAgentWorkflow('hi');
      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(short.isFallback).toBe(true);

      const preferred = await orchestrateAgentWorkflow(
        'my child coughs at night',
        {},
        'eco_auditor'
      );
      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(preferred.agentId).toBe('eco_auditor');
    });

    it('orchestrateMultiAgentConsensus runs three workflows in parallel', async () => {
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const consensus = await orchestrateMultiAgentConsensus({
        familyArchetype: 'school_infant',
        ambientPm25: 415
      });
      expect(consensus.agentsEngaged).toEqual(['IAQEngineer', 'PediatricShield', 'EcoAuditor']);
      expect(consensus.consensusText).toContain('MULTI-AGENT HOUSEHOLD CONSENSUS AUDIT');
      expect(consensus.consensusText).toContain('INDOOR AIR DEFENSE');
      expect(consensus.consensusToken).toMatch(/^[0-9a-f]{64}$/);
      expect(consensus.totalLatencyMs).toBeGreaterThanOrEqual(0);
    });

    it('queryAiAssistant returns the workflow result in wrapper shape', async () => {
      globalThis.fetch.mockImplementation(() => Promise.reject(new Error('offline')));
      const res = await queryAiAssistant('how can I cut carbon emissions?');
      expect(res.agent).toBe('EcoAuditor');
      expect(res.isFallback).toBe(true);
      expect(res.executionMode).toBe('DETERMINISTIC_SPECIALIST');
      expect(res.badge).toMatch(/^[0-9A-F]{12}$/);
      expect(res.trace.length).toBeGreaterThan(0);
    });
  });

  describe('getAiServiceStatus', () => {
    it('reports the hybrid engine configuration', () => {
      const status = getAiServiceStatus();
      expect(status.isLiveConfigured).toBe(true);
      expect(status.engineName).toContain('Hybrid Proxy');
      expect(status.provider).toContain('Multi-Agent Mesh');
    });
  });
});

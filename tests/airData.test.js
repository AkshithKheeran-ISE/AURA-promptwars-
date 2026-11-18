import { describe, it, expect } from 'vitest';
import {
  WARDS_DATA,
  PRIORITY_ALERTS,
  INITIAL_CITIZEN_REPORTS,
  INITIAL_AUDIT_LOGS,
  THIRTY_DAY_FORECAST
} from '../src/data/airData';
import { FAMILY_ARCHETYPES, DAILY_ROUTINE_SLOTS } from '../src/services/routineEngine';
import {
  FAMILY_AGENTS_ROSTER,
  SAMPLE_QUERIES,
  SATELLITE_AGENTS_CONFIG
} from '../src/components/agent/agentConstants';

describe('Data Models & Telemetry Schema Integrity', () => {
  describe('WARDS_DATA', () => {
    it('contains at least 8 urban wards with valid geographic coordinates and AQI metrics', () => {
      expect(WARDS_DATA.length).toBeGreaterThanOrEqual(8);
      WARDS_DATA.forEach((ward) => {
        expect(ward.id).toBeTruthy();
        expect(ward.name).toBeTruthy();
        expect(typeof ward.lat).toBe('number');
        expect(typeof ward.lng).toBe('number');
        expect(ward.lat).toBeGreaterThan(28.0);
        expect(ward.lat).toBeLessThan(29.0);
        expect(ward.lng).toBeGreaterThan(76.5);
        expect(ward.lng).toBeLessThan(77.5);
        expect(typeof ward.aqi).toBe('number');
        expect(ward.aqi).toBeGreaterThanOrEqual(0);
        expect(['Critical', 'High', 'Moderate', 'Good', 'Safe']).toContain(ward.status);
      });
    });
  });

  describe('PRIORITY_ALERTS', () => {
    it('contains structured emergency alerts with executable playbooks', () => {
      expect(PRIORITY_ALERTS.length).toBeGreaterThanOrEqual(3);
      PRIORITY_ALERTS.forEach((alert) => {
        expect(alert.id).toMatch(/^ALR-/);
        expect(alert.title).toBeTruthy();
        expect(alert.ward).toBeTruthy();
        expect(['critical', 'high', 'medium']).toContain(alert.severity);
        expect(Array.isArray(alert.playbook)).toBe(true);
        expect(alert.playbook.length).toBeGreaterThan(0);
        alert.playbook.forEach((action) => {
          expect(action.id).toBeTruthy();
          expect(action.label).toBeTruthy();
          expect(typeof action.done).toBe('boolean');
        });
      });
    });
  });

  describe('INITIAL_CITIZEN_REPORTS & INITIAL_AUDIT_LOGS', () => {
    it('initializes citizen reports with valid hash pointers', () => {
      expect(INITIAL_CITIZEN_REPORTS.length).toBeGreaterThan(0);
      INITIAL_CITIZEN_REPORTS.forEach((rep) => {
        expect(rep.id).toBeTruthy();
        expect(rep.hash).toBeTruthy();
        expect(rep.prevHash).toBeTruthy();
      });
    });

    it('initializes audit logs with timestamped actors and targets', () => {
      expect(INITIAL_AUDIT_LOGS.length).toBeGreaterThan(0);
      INITIAL_AUDIT_LOGS.forEach((log) => {
        expect(log.id).toBeTruthy();
        expect(log.actor).toBeTruthy();
        expect(log.action).toBeTruthy();
        expect(typeof log.ts).toBe('number');
      });
    });
  });

  describe('THIRTY_DAY_FORECAST', () => {
    it('provides exactly 30 days of calibrated forecasts', () => {
      expect(THIRTY_DAY_FORECAST.length).toBe(30);
      THIRTY_DAY_FORECAST.forEach((day, idx) => {
        expect(day.day).toBe(idx + 1);
        expect(typeof day.aqi).toBe('number');
        expect(typeof day.inversionHeight).toBe('number');
        expect(typeof day.windSpeed).toBe('number');
        expect(['Critical', 'High', 'Moderate', 'Satisfactory']).toContain(day.risk);
      });
    });
  });

  describe('FAMILY_ARCHETYPES & ROUTINE SLOTS', () => {
    it.each([['school_infant'], ['asthma_seniors'], ['daily_commuter'], ['rwa_community']])(
      'defines required family archetype "%s"',
      (expectedId) => {
        const ids = FAMILY_ARCHETYPES.map((a) => a.id);
        expect(ids).toContain(expectedId);
      }
    );

    it('covers key diurnal diurnal windows including morning and afternoon ventilation', () => {
      expect(DAILY_ROUTINE_SLOTS.length).toBeGreaterThanOrEqual(4);
      DAILY_ROUTINE_SLOTS.forEach((slot) => {
        expect(slot.timeSlot).toBeTruthy();
        expect(slot.title).toBeTruthy();
        expect(slot.standardPractice).toBeTruthy();
        expect(slot.smogHackRoutine).toBeTruthy();
        expect(slot.impactExplanation).toBeTruthy();
      });
    });
  });

  describe('Agent Roster & Satellite Configuration Metadata', () => {
    it('defines valid agent roster cards, sample queries, and satellite agents', () => {
      expect(FAMILY_AGENTS_ROSTER.length).toBeGreaterThanOrEqual(6);
      FAMILY_AGENTS_ROSTER.forEach((agent) => {
        expect(agent.id).toBeTruthy();
        expect(agent.name).toBeTruthy();
        expect(agent.role).toBeTruthy();
        expect(agent.desc).toBeTruthy();
      });

      expect(SAMPLE_QUERIES.length).toBeGreaterThanOrEqual(4);
      expect(SATELLITE_AGENTS_CONFIG.length).toBeGreaterThanOrEqual(3);
    });
  });
});

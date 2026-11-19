/**
 * Telemetry and Cryptographic Audit Logs.
 */

import { sha256 } from '../utils/crypto';

/**
 * Computes deterministic SHA-256 hash for an audit log entry.
 * @param {object} log
 * @returns {string} SHA-256 hex digest
 */
export const computeAuditHash = (log) => {
  return sha256(
    JSON.stringify({
      id: log.id,
      ts: log.ts,
      actor: log.actor,
      action: log.action,
      target: log.target,
      type: log.type
    })
  );
};

export const createAuditLog = (id, offsetMs, actor, action, target, type) => {
  const ts = 1731950000000 - offsetMs;
  const hash = computeAuditHash({ id, ts, actor, action, target, type });
  return {
    id,
    ts,
    actor,
    action,
    target,
    type,
    hash
  };
};

export const INITIAL_AUDIT_LOGS = [
  createAuditLog(
    'AUD-9912',
    45000,
    'EmergencyResponder (AI)',
    'Auto-dispatched 4 Anti-Smog Cannons',
    'Wazirpur Sector East',
    'agent'
  ),
  createAuditLog(
    'AUD-9911',
    120000,
    'Analyst Akshith (Human)',
    'Elevated Incident ALR-DEL-901 to Stage-IV',
    'Municipal Control Room',
    'human'
  ),
  createAuditLog(
    'AUD-9910',
    240000,
    'BioValidator (AI)',
    'Filtered 18 false sensor condensation spikes',
    'Riverfront East Sensors',
    'agent'
  ),
  createAuditLog(
    'AUD-9909',
    360000,
    'CEMS Gateway (System)',
    'Flagged Tamper Alert on Stack 2 Incinerator',
    'Okhla CEMS-OKH-04',
    'system'
  ),
  createAuditLog(
    'AUD-9908',
    480000,
    'Citizen Suresh (Citizen)',
    'Logged open waste burning report',
    'REP-AURA-8101 / Anand Vihar',
    'human'
  ),
  createAuditLog(
    'AUD-9907',
    600000,
    'PolicyAuditor (AI)',
    'Calculated ₹15,00,000 environmental violation fine',
    'Okhla Waste Plant',
    'agent'
  ),
  createAuditLog(
    'AUD-9906',
    750000,
    'Drone Sentinel-Air-01',
    'Completed FLIR aerial plume scan of Sector 1',
    'Wazirpur Stacks',
    'agent'
  ),
  createAuditLog(
    'AUD-9905',
    900000,
    'AerosolNet (AI)',
    'Synchronized Sentinel-5P TROPOMI raster tiles',
    'National Ingestion Store',
    'agent'
  ),
  createAuditLog(
    'AUD-9904',
    1200000,
    'MeteoForecaster (AI)',
    'Updated 30-Day WRF-Chem atmospheric forecast',
    'City Dispersion Mesh',
    'agent'
  ),
  createAuditLog(
    'AUD-9903',
    1500000,
    'Zero-Trust Mesh (System)',
    'Validated SHA-256 telemetry block checksums',
    '3,420 IoT Nodes',
    'system'
  )
];

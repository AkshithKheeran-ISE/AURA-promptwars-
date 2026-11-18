import { useState, useRef } from 'react';
import { INITIAL_CITIZEN_REPORTS } from '../data/airData';
import { computeBlockHash, verifyLedgerIntegrity, repairLedgerChain } from '../utils/sanitize';

const INITIAL_CANONICAL_LEDGER = INITIAL_CITIZEN_REPORTS.reduce((acc, rep) => {
  acc[rep.id] = { ...rep };
  return acc;
}, {});

const STAGE_TRANSITIONS = {
  1: { next: 2, text: 'RWA / Society Triage' },
  2: { next: 3, text: 'Municipal Flying Squad Dispatched' },
  3: { next: 4, text: 'Hazard Doused & Fine Issued' }
};

function createReportRecord(newReportData, lastHash) {
  const newId = `REP-AURA-${Math.floor(8200 + Math.random() * 800)}`;
  const record = {
    id: newId,
    issue: newReportData.issue,
    location: newReportData.location,
    reporter: newReportData.reporter || 'Priya Family Member',
    urgency: newReportData.urgency || 'High',
    lat: 28.65 + (Math.random() - 0.5) * 0.1,
    lng: 77.2 + (Math.random() - 0.5) * 0.1,
    timestamp: 'Just now',
    prevHash: lastHash,
    hash: '',
    stage: 1,
    statusText: 'Hashed to Community Ledger'
  };
  record.hash = computeBlockHash(record, lastHash);
  return record;
}

function updateReportStage(rep, reportId, canonicalLedger) {
  if (rep.id === reportId && rep.stage < 4) {
    const nextInfo = STAGE_TRANSITIONS[rep.stage];
    if (canonicalLedger[reportId]) {
      canonicalLedger[reportId].stage = nextInfo.next;
      canonicalLedger[reportId].statusText = nextInfo.text;
    }
    return { ...rep, stage: nextInfo.next, statusText: nextInfo.text };
  }
  return rep;
}

function restoreLedgerConsensus(recovery, brokenIdx, callbacks) {
  const { setReports, setTampered, setQuarantine, addToast, logAudit } = callbacks;
  setReports(recovery.repairedChain);
  setTampered(false);
  if (recovery.quarantinedEvidence.length > 0) {
    setQuarantine((prev) => [...recovery.quarantinedEvidence, ...prev]);
  }
  addToast(
    'Cryptographic Consensus Restored',
    `Repaired ${recovery.restoredCount} tampered block(s). All ${recovery.preservedCount} citizen reports preserved intact.`,
    'green'
  );
  logAudit(
    'Validator Agent (AI)',
    `Resolved ledger breach at Block #${brokenIdx + 1}. Re-anchored consensus with zero user data loss (${recovery.preservedCount} blocks intact).`,
    'Ledger Root',
    'agent'
  );
}

function applyTamperSimulation(callbacks) {
  const { setReports, setTampered, addToast, logAudit } = callbacks;
  setReports((prev) => {
    if (prev.length <= 1) return prev;
    const copy = [...prev];
    copy[1] = {
      ...copy[1],
      issue: '[TAMPERED BY POLLUTER] Falsified report to conceal industrial burning',
      hash: '000000000000000000000000000000000000000000000000000000000000dead'
    };
    return copy;
  });
  setTampered(true);
  addToast('SECURITY ALARM', 'Cryptographic hash mismatch! Block #2 chain broken!', 'red');
  logAudit(
    'IDS Watchdog',
    'Flagged unauthorized tampering attempt on community report ledger',
    'REP-AURA-8102',
    'system'
  );
}

function executeLedgerVerification(citizenReports, canonicalLedger, callbacks) {
  const { setTampered, addToast, logAudit } = callbacks;
  const result = verifyLedgerIntegrity(citizenReports);
  if (!result.valid) {
    const recovery = repairLedgerChain(citizenReports, canonicalLedger);
    if (recovery.success) {
      restoreLedgerConsensus(recovery, result.brokenIndex, callbacks);
    }
  } else {
    setTampered(false);
    addToast(
      'Ledger Verified',
      `All ${citizenReports.length} blocks checked. SHA-256 hash chains 100% intact.`,
      'green'
    );
    logAudit(
      'Validator Agent (AI)',
      `Cryptographically verified all ${citizenReports.length} hash chains on reporting ledger`,
      'Ledger Root',
      'agent'
    );
  }
}

/**
 * Manages citizen hazard reporting and cryptographic tamper detection & recovery.
 * @param {Function} addToast - Toast dispatcher
 * @param {Function} logAudit - Audit logger
 */
export function useCitizenLedgerState(addToast, logAudit) {
  const [citizenReports, setCitizenReports] = useState(INITIAL_CITIZEN_REPORTS);
  const [ledgerTampered, setLedgerTampered] = useState(false);
  const [quarantinedEvidence, setQuarantinedEvidence] = useState([]);
  const canonicalLedgerRef = useRef({ ...INITIAL_CANONICAL_LEDGER });

  const addCitizenReport = (newReportData) => {
    const lastHash =
      citizenReports.length > 0 ? citizenReports[citizenReports.length - 1].hash : '0'.repeat(64);
    const completeReport = createReportRecord(newReportData, lastHash);
    canonicalLedgerRef.current[completeReport.id] = { ...completeReport };
    setCitizenReports((prev) => [...prev, completeReport]);
    addToast(
      'Report Secured',
      `Hazard report ${completeReport.id} chained to immutable ledger`,
      'cyan'
    );
    logAudit(
      'Community Reporter',
      `Logged community smog report: ${newReportData.issue.slice(0, 30)}...`,
      completeReport.id,
      'human'
    );
  };

  const advanceReportStage = (reportId) => {
    setCitizenReports((prev) =>
      prev.map((rep) => updateReportStage(rep, reportId, canonicalLedgerRef.current))
    );
    addToast(
      'Workflow Advanced',
      `Report ${reportId} progressed to next operational tier`,
      'green'
    );
    logAudit('RWA Committee', `Advanced community action stage for ${reportId}`, reportId, 'human');
  };

  const simulateTamper = () => {
    applyTamperSimulation({
      setReports: setCitizenReports,
      setTampered: setLedgerTampered,
      addToast,
      logAudit
    });
  };

  const verifyLedger = () => {
    executeLedgerVerification(citizenReports, canonicalLedgerRef.current, {
      setReports: setCitizenReports,
      setTampered: setLedgerTampered,
      setQuarantine: setQuarantinedEvidence,
      addToast,
      logAudit
    });
  };

  return {
    citizenReports,
    addCitizenReport,
    advanceReportStage,
    simulateTamper,
    verifyLedger,
    ledgerTampered,
    quarantinedEvidence
  };
}

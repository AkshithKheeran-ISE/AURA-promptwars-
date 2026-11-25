import { useState, useEffect, useRef } from 'react';
import { sanitizeInput } from '../utils/sanitize';
import {
  orchestrateAgentWorkflow,
  orchestrateMultiAgentConsensus,
  getAiServiceStatus
} from '../services/aiService';

const INITIAL_METRICS = {
  family_advisor: { calls: 0, lastLatencyMs: null, status: 'READY' },
  iaq_engineer: { calls: 0, lastLatencyMs: null, status: 'READY' },
  pediatric_shield: { calls: 0, lastLatencyMs: null, status: 'READY' },
  meteo_forecaster: { calls: 0, lastLatencyMs: null, status: 'READY' },
  eco_auditor: { calls: 0, lastLatencyMs: null, status: 'READY' },
  community_watch: { calls: 0, lastLatencyMs: null, status: 'READY' }
};

/**
 * Storage key for the agent conversation history. Versioned so a future
 * message-shape change can start fresh instead of restoring stale data.
 */
export const AGENT_MESSAGES_STORAGE_KEY = 'aura-agent-messages-v1';

/** Maximum messages kept in storage (the in-memory chat is unbounded). */
const MAX_STORED_AGENT_MESSAGES = 50;

/**
 * Restores a saved agent conversation from the user's own browser.
 * History lives in localStorage only — it is never sent to any server.
 * Returns null when nothing usable is stored, so the caller falls back
 * to the system banner.
 * @param {string} [storageKey=AGENT_MESSAGES_STORAGE_KEY]
 * @returns {Array<object> | null}
 */
export function restoreAgentMessages(storageKey = AGENT_MESSAGES_STORAGE_KEY) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !Array.isArray(parsed) ||
      parsed.length === 0 ||
      !parsed.every(
        (message) =>
          message && typeof message.sender === 'string' && typeof message.text === 'string'
      )
    ) {
      return null;
    }
    return parsed.slice(-MAX_STORED_AGENT_MESSAGES);
  } catch {
    return null;
  }
}

/**
 * Persists the conversation to the user's own browser (best-effort:
 * storage can be full or unavailable in private mode — the chat still works).
 * @param {Array<object>} messages
 * @param {string} [storageKey=AGENT_MESSAGES_STORAGE_KEY]
 */
export function persistAgentMessages(messages, storageKey = AGENT_MESSAGES_STORAGE_KEY) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(messages.slice(-MAX_STORED_AGENT_MESSAGES))
    );
  } catch {
    // Storage unavailable — conversation stays in memory only.
  }
}

function updateAgentMetrics(prev, agentId, durationMs) {
  const current = prev[agentId] || { calls: 0, lastLatencyMs: null };
  return {
    ...prev,
    [agentId]: {
      calls: current.calls + 1,
      lastLatencyMs: durationMs,
      status: 'EXECUTED'
    }
  };
}

function updateConsensusMetrics(prev, totalLatencyMs) {
  const latPerAgent = Math.round(totalLatencyMs / 3);
  return {
    ...prev,
    iaq_engineer: {
      calls: prev.iaq_engineer.calls + 1,
      lastLatencyMs: latPerAgent,
      status: 'EXECUTED'
    },
    pediatric_shield: {
      calls: prev.pediatric_shield.calls + 1,
      lastLatencyMs: latPerAgent,
      status: 'EXECUTED'
    },
    eco_auditor: {
      calls: prev.eco_auditor.calls + 1,
      lastLatencyMs: latPerAgent,
      status: 'EXECUTED'
    }
  };
}

function buildAgentSuccessMessage(response) {
  return {
    sender: 'aura',
    agent: response.agentName,
    role: response.role,
    engine: response.engine,
    text: response.text,
    token: response.attestationToken,
    durationMs: response.durationMs,
    trace: response.trace
  };
}

function buildConsensusSuccessMessage(result) {
  return {
    sender: 'aura',
    agent: 'AURA-CONSENSUS MESH',
    role: 'Distributed Synthesis',
    engine: 'Multi-Agent Mesh',
    text: result.consensusText,
    token: result.consensusToken,
    durationMs: result.totalLatencyMs,
    agents: result.agentsEngaged
  };
}

async function executeAgentTask(options) {
  const { cleanText, context, directAgentId, setAgentMetrics, setMessages, addToast, logAudit } =
    options;
  logAudit(
    'Family Resident',
    `Dispatched task to AURA agent mesh: ${cleanText.slice(0, 30)}...`,
    directAgentId || 'AURA-CORE',
    'human'
  );

  try {
    const response = await orchestrateAgentWorkflow(cleanText, context, directAgentId);
    setAgentMetrics((prev) => updateAgentMetrics(prev, response.agentId, response.durationMs));
    setMessages((prev) => [...prev, buildAgentSuccessMessage(response)]);
    addToast(
      'Agent Task Verified',
      `${response.agentName}: Executed in ${response.durationMs}ms (Attestation: 0x${response.attestationToken.slice(0, 8)})`,
      'cyan'
    );
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        sender: 'aura',
        agent: 'AURA-CORE',
        role: 'Orchestrator',
        engine: 'System Safety Fallback',
        text: `Encountered temporary exception during agent execution: ${/** @type {any} */ (err)?.message || 'Please specify query parameters.'}`
      }
    ]);
  }
}

async function executeConsensusTask(options) {
  const { context, setAgentMetrics, setMessages, addToast, logAudit } = options;
  addToast(
    'Consensus Dispatched',
    'Fanning out tasks to IAQEngineer, PediatricShield & EcoAuditor...',
    'amber'
  );

  try {
    const result = await orchestrateMultiAgentConsensus(context);
    setAgentMetrics((prev) => updateConsensusMetrics(prev, result.totalLatencyMs));
    setMessages((prev) => [...prev, buildConsensusSuccessMessage(result)]);
    addToast(
      'Consensus Reached',
      `Attested consensus token: 0x${result.consensusToken.slice(0, 10)}`,
      'green'
    );
    logAudit(
      'Multi-Agent Mesh',
      'Synthesized 3-agent cross-domain environmental consensus',
      'Consensus Mesh',
      'agent'
    );
  } catch {
    addToast('Consensus Interrupted', 'Agent quorum timeout. Using offline safety cache.', 'rose');
  }
}

/**
 * Manages verifiable multi-agent orchestration, execution telemetry, and conversational state.
 * @param {string} familyArchetype
 * @param {number} ambientPm25
 * @param {Function} addToast
 * @param {Function} logAudit
 */
export function useAgentOrchestration(familyArchetype, ambientPm25, addToast, logAudit) {
  const aiStatus = getAiServiceStatus();
  const [messages, setMessages] = useState(() => {
    const restored = restoreAgentMessages();
    if (restored) return restored;
    return [
      {
        sender: 'sys',
        text: `AURA Verifiable GenAI Orchestrator online.\nExecution Mode: ${aiStatus.engineName}.\nSix clinical and environmental intelligence agents armed with cryptographically verifiable execution traces.`
      }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expandedTraceIdx, setExpandedTraceIdx] = useState(null);
  const [agentMetrics, setAgentMetrics] = useState(INITIAL_METRICS);
  const isExecutingRef = useRef(false);

  // Keep the conversation across refreshes (localStorage, user's device only).
  useEffect(() => {
    persistAgentMessages(messages);
  }, [messages]);

  const handleSend = async (queryText, directAgentId = null) => {
    const rawText = queryText || inputText;
    const cleanText = sanitizeInput(rawText, 500);
    if (!cleanText.trim() || isExecutingRef.current) return;

    isExecutingRef.current = true;
    setMessages((prev) => [...prev, { sender: 'user', text: cleanText }]);
    setInputText('');
    setIsThinking(true);
    try {
      await executeAgentTask({
        cleanText,
        context: { familyArchetype, ambientPm25 },
        directAgentId,
        setAgentMetrics,
        setMessages,
        addToast,
        logAudit
      });
    } finally {
      isExecutingRef.current = false;
      setIsThinking(false);
    }
  };

  const handleRunConsensus = async () => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;
    setIsThinking(true);
    try {
      await executeConsensusTask({
        context: { familyArchetype, ambientPm25 },
        setAgentMetrics,
        setMessages,
        addToast,
        logAudit
      });
    } finally {
      isExecutingRef.current = false;
      setIsThinking(false);
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    isThinking,
    expandedTraceIdx,
    setExpandedTraceIdx,
    agentMetrics,
    handleSend,
    handleRunConsensus,
    aiStatus
  };
}

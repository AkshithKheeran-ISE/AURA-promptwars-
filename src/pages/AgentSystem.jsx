import React, { useState } from 'react';
import { Cpu, Layers } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { sanitizeInput } from '../utils/sanitize';
import {
  orchestrateAgentWorkflow,
  orchestrateMultiAgentConsensus,
  getAiServiceStatus
} from '../services/aiService';
import AgentTopology from '../components/agent/AgentTopology';
import AgentTerminal from '../components/agent/AgentTerminal';
import AgentRosterGrid from '../components/agent/AgentRosterGrid';

/**
 * AURA GenAI Multi-Agent Smog Defense Assistant Page.
 * Coordinates 6 domain agents with verifiable cryptographic execution traces.
 */
export default function AgentSystem() {
  const { addToast, logAudit, familyArchetype, selectedWard } = useApp();
  const aiStatus = getAiServiceStatus();

  const [messages, setMessages] = useState([
    {
      sender: 'sys',
      text: `AURA Verifiable GenAI Orchestrator online.\nExecution Mode: ${aiStatus.engineName}.\nSix clinical and environmental intelligence agents armed with cryptographically verifiable execution traces.`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expandedTraceIdx, setExpandedTraceIdx] = useState(null);

  // Real-time Agent Execution Telemetry
  const [agentMetrics, setAgentMetrics] = useState({
    family_advisor: { calls: 0, lastLatencyMs: null, status: 'READY' },
    iaq_engineer: { calls: 0, lastLatencyMs: null, status: 'READY' },
    pediatric_shield: { calls: 0, lastLatencyMs: null, status: 'READY' },
    meteo_forecaster: { calls: 0, lastLatencyMs: null, status: 'READY' },
    eco_auditor: { calls: 0, lastLatencyMs: null, status: 'READY' },
    community_watch: { calls: 0, lastLatencyMs: null, status: 'READY' }
  });

  const handleSend = async (queryText, directAgentId = null) => {
    const rawText = queryText || inputText;
    const cleanText = sanitizeInput(rawText, 500);
    if (!cleanText.trim()) return;

    const userMsg = { sender: 'user', text: cleanText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    logAudit(
      'Family Resident',
      `Dispatched task to AURA agent mesh: ${cleanText.slice(0, 30)}...`,
      directAgentId || 'AURA-CORE',
      'human'
    );

    try {
      const response = await orchestrateAgentWorkflow(
        cleanText,
        { familyArchetype, ambientPm25: selectedWard.pm25 },
        directAgentId
      );

      // Update live agent telemetry
      setAgentMetrics((prev) => {
        const current = prev[response.agentId] || { calls: 0, lastLatencyMs: null };
        return {
          ...prev,
          [response.agentId]: {
            calls: current.calls + 1,
            lastLatencyMs: response.durationMs,
            status: 'EXECUTED'
          }
        };
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'aura',
          agent: response.agentName,
          role: response.role,
          engine: response.engine,
          text: response.text,
          token: response.attestationToken,
          durationMs: response.durationMs,
          trace: response.trace
        }
      ]);

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
          text: `Encountered temporary exception during agent execution: ${err?.message || 'Please specify query parameters.'}`
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleRunConsensus = async () => {
    setIsThinking(true);
    addToast(
      'Consensus Dispatched',
      'Fanning out tasks to IAQEngineer, PediatricShield & EcoAuditor...',
      'amber'
    );

    try {
      const result = await orchestrateMultiAgentConsensus({
        familyArchetype,
        ambientPm25: selectedWard.pm25
      });

      // Update metrics for all 3 agents
      setAgentMetrics((prev) => ({
        ...prev,
        iaq_engineer: {
          calls: prev.iaq_engineer.calls + 1,
          lastLatencyMs: Math.round(result.totalLatencyMs / 3),
          status: 'EXECUTED'
        },
        pediatric_shield: {
          calls: prev.pediatric_shield.calls + 1,
          lastLatencyMs: Math.round(result.totalLatencyMs / 3),
          status: 'EXECUTED'
        },
        eco_auditor: {
          calls: prev.eco_auditor.calls + 1,
          lastLatencyMs: Math.round(result.totalLatencyMs / 3),
          status: 'EXECUTED'
        }
      }));

      setMessages((prev) => [
        ...prev,
        {
          sender: 'aura',
          agent: 'AURA Consensus Mesh',
          role: 'Multi-Agent Collective',
          engine: 'Parallel Consensus Engine',
          text: result.consensusText,
          token: result.consensusToken,
          durationMs: result.totalLatencyMs,
          trace: [
            {
              step: 'PARALLEL_FANOUT',
              status: 'OK',
              detail: 'Dispatched to IAQEngineer, PediatricShield, EcoAuditor'
            },
            {
              step: 'SYNTHESIS',
              status: 'OK',
              detail: `Synthesized 3 distinct domain protocols in ${result.totalLatencyMs}ms`
            },
            {
              step: 'CONSENSUS_TOKEN',
              status: 'SIGNED',
              detail: `Cryptographic Token: 0x${result.consensusToken.slice(0, 16)}`
            }
          ]
        }
      ]);

      addToast(
        'Consensus Complete',
        `3 agents synthesized household defense protocol in ${result.totalLatencyMs}ms`,
        'green'
      );
    } catch (err) {
      addToast(
        'Consensus Error',
        `Consensus execution failed: ${err?.message || 'Unknown error'}`,
        'rose'
      );
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="08 · Verifiable Intelligence"
        title="AURA GenAI · Verifiable Multi-Agent Smog Defense Assistant"
        desc="Six specialized atmospheric and household intelligence agents coordinated by AURA-CORE with real execution tracing, cryptographic SHA-256 task tokens, and secure serverless proxy integration."
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunConsensus}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-400/15 px-3 py-1.5 font-mono text-xs text-emerald-200 hover:bg-emerald-400/25 transition cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>Run Multi-Agent Consensus</span>
            </button>
            <span className="flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-[#0c182c] px-3 py-1.5 font-mono text-xs text-cyan-300">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>Verifiable Mesh</span>
            </span>
          </div>
        }
      />

      {/* Main Row: Visual Multi-Agent Architecture (Left) + AI Command Terminal (Right) */}
      <div className="grid gap-6 xl:grid-cols-2">
        <AgentTopology
          agentMetrics={agentMetrics}
          onRunConsensus={handleRunConsensus}
          onExecuteAgent={handleSend}
        />
        <AgentTerminal
          messages={messages}
          inputText={inputText}
          isThinking={isThinking}
          expandedTraceIdx={expandedTraceIdx}
          onInputChange={setInputText}
          onSend={handleSend}
          onToggleTrace={setExpandedTraceIdx}
        />
      </div>

      {/* Family Agent Roster Grid */}
      <AgentRosterGrid agentMetrics={agentMetrics} onExecuteAgent={handleSend} />
    </div>
  );
}

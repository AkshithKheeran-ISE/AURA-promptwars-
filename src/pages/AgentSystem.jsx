import React from 'react';
import { Cpu, Layers } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useUi, useHousehold } from '../context/AppContext';
import { useAgentOrchestration } from '../hooks/useAgentOrchestration';
import AgentTopology from '../components/agent/AgentTopology';
import AgentTerminal from '../components/agent/AgentTerminal';
import AgentRosterGrid from '../components/agent/AgentRosterGrid';

/**
 * AURA GenAI Multi-Agent Smog Defense Assistant Page.
 * Coordinates 6 domain agents with verifiable cryptographic execution traces.
 */
export default function AgentSystem() {
  const { addToast, logAudit } = useUi();
  const { familyArchetype, selectedWard } = useHousehold();
  const {
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
  } = useAgentOrchestration(familyArchetype, selectedWard.pm25, addToast, logAudit);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="07 · Verifiable Intelligence"
        title="Autonomous Environmental Multi-Agent Mesh"
        desc="Six specialized domain agents running with client-side deterministic verification, SHA-256 provenance tokens, and live serverless Gemini proxy orchestration."
        right={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="flex items-center gap-1.5 rounded border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-cyan-300 font-bold">
              <Cpu className="h-3.5 w-3.5" />
              {aiStatus.engineName}
            </span>
            <span className="flex items-center gap-1.5 rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-300">
              <Layers className="h-3.5 w-3.5" />6 AGENTS ONLINE
            </span>
          </div>
        }
      />

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

      <AgentRosterGrid agentMetrics={agentMetrics} onExecuteAgent={handleSend} />
    </div>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import { Send, Terminal, Sparkles, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { SAMPLE_QUERIES } from './agentConstants';

function AgentQuickPrompts({ onSend }) {
  return (
    <div className="py-2 space-y-1">
      <div className="label text-[9px] text-slate-500">Quick Family Prompts:</div>
      <div className="flex flex-wrap gap-1.5">
        {SAMPLE_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSend(q)}
            className="rounded bg-[#030712] border border-cyan-400/20 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:border-cyan-400/60 hover:text-cyan-200 transition cursor-pointer text-left truncate max-w-full"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

AgentQuickPrompts.propTypes = {
  onSend: PropTypes.func.isRequired
};

function MessageSenderHeader({ m }) {
  if (m.sender === 'user') {
    return <span className="ml-auto text-cyan-300 font-bold">FAMILY RESIDENT</span>;
  }
  if (m.sender === 'sys') {
    return <span className="text-slate-400">SYSTEM</span>;
  }
  return (
    <>
      <ShieldCheck className="h-3 w-3 text-cyan-400" />
      <span className="text-white font-bold">{m.agent}</span>
      {m.durationMs && (
        <span className="text-[9px] text-emerald-400">
          ({m.durationMs}ms · Token: 0x{m.token?.slice(0, 8)})
        </span>
      )}
    </>
  );
}

MessageSenderHeader.propTypes = {
  m: PropTypes.object.isRequired
};

function ExecutionTraceView({ trace, isExpanded, onToggle }) {
  if (!trace || trace.length === 0) return null;
  return (
    <div className="mt-2.5 pt-2 border-t border-cyan-400/15 text-[10px]">
      <button
        onClick={onToggle}
        className="text-cyan-400 hover:text-cyan-200 flex items-center gap-1 cursor-pointer font-bold"
      >
        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <span>Verifiable Execution Trace ({trace.length} steps)</span>
      </button>
      {isExpanded && (
        <div className="mt-1.5 space-y-1 p-2 rounded bg-black/70 border border-cyan-400/10">
          {trace.map((step, sIdx) => (
            <div key={sIdx} className="text-slate-400 flex items-start gap-2">
              <span className="text-emerald-400 shrink-0 font-bold">[{step.status}]</span>
              <div>
                <span className="text-white font-bold">{step.step}: </span>
                <span>{step.detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ExecutionTraceView.propTypes = {
  trace: PropTypes.array,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

function EngagedAgentsView({ agents }) {
  if (!agents || agents.length === 0) return null;
  return (
    <div className="mt-2.5 pt-2 border-t border-cyan-400/15 text-[10px] flex items-center gap-1.5 flex-wrap">
      <span className="text-slate-400 font-bold">Agents Engaged:</span>
      {agents.map((ag) => (
        <span
          key={ag}
          className="px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/30"
        >
          {ag}
        </span>
      ))}
    </div>
  );
}

EngagedAgentsView.propTypes = {
  agents: PropTypes.arrayOf(PropTypes.string)
};

function AgentChatMessage({ m, idx, expandedTraceIdx, onToggleTrace }) {
  const isUser = m.sender === 'user';
  const isSys = m.sender === 'sys';
  return (
    <div className={`space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 justify-start">
        <MessageSenderHeader m={m} />
      </div>
      <div
        className={`inline-block rounded-lg p-3 text-left leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-cyan-400/20 text-cyan-100 border border-cyan-400/40'
            : isSys
              ? 'bg-[#0c182c] text-slate-300 border border-cyan-400/10'
              : 'bg-[#08101e] text-slate-100 border border-cyan-400/30'
        }`}
      >
        {m.text}
        <EngagedAgentsView agents={m.agents} />
        <ExecutionTraceView
          trace={m.trace}
          isExpanded={expandedTraceIdx === idx}
          onToggle={() => onToggleTrace(expandedTraceIdx === idx ? null : idx)}
        />
      </div>
    </div>
  );
}

AgentChatMessage.propTypes = {
  m: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  expandedTraceIdx: PropTypes.number,
  onToggleTrace: PropTypes.func.isRequired
};

/**
 * Interactive GenAI terminal showing conversation history, verifiable execution traces, and input form.
 */
export default function AgentTerminal({
  messages,
  inputText,
  isThinking,
  expandedTraceIdx,
  onInputChange,
  onSend,
  onToggleTrace
}) {
  return (
    <div className="panel panel-corners p-5 space-y-3 flex flex-col justify-between">
      <div>
        <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
          <div>
            <span className="label text-cyan-300">Conversational Air Intelligence</span>
            <h2 className="text-lg font-bold text-white">GenAI Smog Assistant Terminal</h2>
          </div>
          <Terminal className="h-4 w-4 text-cyan-400" />
        </div>

        <AgentQuickPrompts onSend={onSend} />

        <div
          className="h-72 space-y-3 overflow-y-auto rounded-lg bg-black/50 p-4 font-mono text-xs border border-cyan-400/15"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map((m, idx) => (
            <AgentChatMessage
              key={idx}
              m={m}
              idx={idx}
              expandedTraceIdx={expandedTraceIdx}
              onToggleTrace={onToggleTrace}
            />
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-cyan-300 text-xs">
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>AURA agents calculating inversion profiles and indoor exposure...</span>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSend();
        }}
        className="flex items-center gap-2 border-t border-cyan-400/10 pt-3"
      >
        <label htmlFor="agent-query-input" className="sr-only">
          Ask AURA GenAI Assistant
        </label>
        <span className="font-mono text-cyan-400 font-bold" aria-hidden="true">
          &gt;
        </span>
        <input
          id="agent-query-input"
          type="text"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask for custom family routines, Corsi box tips, or impact calculations..."
          aria-label="Ask for custom family routines, Corsi box tips, or impact calculations"
          className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send message to GenAI assistant"
          className="rounded-lg bg-cyan-400 p-2 text-black hover:bg-cyan-300 transition cursor-pointer"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

AgentTerminal.propTypes = {
  messages: PropTypes.array.isRequired,
  inputText: PropTypes.string.isRequired,
  isThinking: PropTypes.bool.isRequired,
  expandedTraceIdx: PropTypes.number,
  onInputChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  onToggleTrace: PropTypes.func.isRequired
};

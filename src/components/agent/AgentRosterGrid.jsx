import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2 } from 'lucide-react';
import { FAMILY_AGENTS_ROSTER } from './agentConstants';

/**
 * Grid display of all 6 specialized family protection agents with live telemetry.
 */
export default function AgentRosterGrid({ agentMetrics, onExecuteAgent }) {
  return (
    <div className="panel p-5 space-y-3">
      <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
        <div>
          <span className="label text-cyan-300">Family Protection Capabilities</span>
          <h2 className="text-lg font-bold text-white">Active Specialized AI Agents</h2>
        </div>
        <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" /> 6 Clinical & Environmental Models Verified
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FAMILY_AGENTS_ROSTER.map((agent) => {
          const metrics = agentMetrics[agent.id] || { calls: 0, lastLatencyMs: null };
          return (
            <div
              key={agent.id}
              className="p-4 rounded-xl border border-cyan-400/10 bg-[#030712] space-y-2 font-mono text-xs hover:border-cyan-400/30 transition flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-white text-sm"
                    style={{ color: agent.avatarColor }}
                  >
                    {agent.name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      metrics.calls > 0
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'bg-emerald-400/15 text-emerald-400'
                    }`}
                  >
                    {metrics.calls > 0 ? `${metrics.calls} RUNS` : 'READY'}
                  </span>
                </div>

                <div className="text-cyan-300 text-[11px] font-semibold">{agent.role}</div>
                <p className="text-slate-400 font-sans text-xs leading-relaxed">{agent.desc}</p>
              </div>

              <div className="pt-2 border-t border-cyan-400/10 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">
                  {metrics.lastLatencyMs ? `Latency: ${metrics.lastLatencyMs}ms` : 'Status: Ready'}
                </span>
                <button
                  onClick={() => onExecuteAgent(agent.sampleQuery, agent.id)}
                  className="text-cyan-400 hover:text-cyan-200 transition cursor-pointer font-bold"
                  title={agent.sampleQuery}
                >
                  Execute Agent &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

AgentRosterGrid.propTypes = {
  agentMetrics: PropTypes.object.isRequired,
  onExecuteAgent: PropTypes.func.isRequired
};

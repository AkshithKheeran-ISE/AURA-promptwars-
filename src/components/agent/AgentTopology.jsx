import React from 'react';
import PropTypes from 'prop-types';
import { FAMILY_AGENTS_ROSTER, SATELLITE_AGENTS_CONFIG } from './agentConstants';

/**
 * Animated SVG network topology map displaying multi-agent consensus core and satellite nodes.
 */
export default function AgentTopology({ agentMetrics, onRunConsensus, onExecuteAgent }) {
  return (
    <div className="panel p-5 space-y-4 relative overflow-hidden">
      <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
        <div>
          <span className="label text-cyan-300">Verifiable Agent Mesh</span>
          <h2 className="text-lg font-bold text-white">Family Protection Topology</h2>
        </div>
        <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> 6 AGENTS STANDBY
        </span>
      </div>

      <div className="relative h-[440px] w-full grid-bg rounded-xl border border-cyan-400/15 overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[
            { x: 20, y: 20, stroke: '#22d3ee' },
            { x: 80, y: 20, stroke: '#34d399' },
            { x: 15, y: 50, stroke: '#f43f5e' },
            { x: 85, y: 50, stroke: '#a855f7' },
            { x: 25, y: 80, stroke: '#fbbf24' },
            { x: 75, y: 80, stroke: '#38bdf8' }
          ].map((l, idx) => (
            <line
              key={idx}
              x1="50"
              y1="50"
              x2={l.x}
              y2={l.y}
              stroke={l.stroke}
              strokeWidth="1"
              strokeDasharray="2 2"
              className="animate-dash"
              opacity="0.6"
            />
          ))}
        </svg>

        {/* Central Orchestrator Core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <button
            onClick={onRunConsensus}
            className="relative mx-auto grid h-24 w-36 place-items-center rounded-xl border-2 border-cyan-400/70 bg-[#08101e] shadow-glow p-2 cursor-pointer hover:scale-105 transition"
            title="Click to run multi-agent consensus"
          >
            <img src="./aura.svg" alt="AURA-CORE" className="h-8 w-8" />
            <div className="font-display text-xs font-black tracking-widest text-white mt-1">
              AURA-CORE
            </div>
            <div className="font-mono text-[8px] text-cyan-300">CLICK FOR CONSENSUS</div>
          </button>
        </div>

        {/* Satellite Agents Network */}
        {SATELLITE_AGENTS_CONFIG.map(
          ({ agentId, rosterIndex, posClass, borderClass, textClass, fallbackLabel }) => {
            const agent = FAMILY_AGENTS_ROSTER[rosterIndex];
            const metrics = agentMetrics[agentId] || { calls: 0, lastLatencyMs: null };
            return (
              <button
                key={agentId}
                onClick={() => onExecuteAgent(agent.sampleQuery, agentId)}
                className={`absolute ${posClass} text-center cursor-pointer hover:scale-105 transition`}
              >
                <div
                  className={`p-2 rounded-lg border ${borderClass} bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5`}
                >
                  <div className={`${textClass} font-bold`}>{agent.name}</div>
                  <div className="text-[8px] text-slate-400">
                    {metrics.calls > 0
                      ? `${metrics.calls} runs (${metrics.lastLatencyMs}ms)`
                      : fallbackLabel}
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

AgentTopology.propTypes = {
  agentMetrics: PropTypes.object.isRequired,
  onRunConsensus: PropTypes.func.isRequired,
  onExecuteAgent: PropTypes.func.isRequired
};

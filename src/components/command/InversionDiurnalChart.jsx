import React from 'react';
import { HOURLY_TRENDS } from '../../data/airData';

/**
 * 24-hour diurnal particulate and nocturnal temperature inversion chart.
 */
export default function InversionDiurnalChart() {
  const points = HOURLY_TRENDS.map((pt, i) => {
    const val = pt.pm25;
    const x = (i / (HOURLY_TRENDS.length - 1)) * 500;
    const y = 165 - (val / 450) * 135;
    return { x, y, val, time: pt.time };
  });

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );
  const areaD = `${pathD} L 500 165 L 0 165 Z`;

  return (
    <div className="panel p-5 xl:col-span-2 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="label text-cyan-300">Atmospheric Dynamics</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-400/10 text-purple-300 border border-purple-400/30">
              WRF-CHEM SIMULATION
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">24-Hour Diurnal Smog & Ventilation Curve</h2>
        </div>
        <div className="flex items-center gap-1 bg-[#030712] p-1 rounded-lg border border-cyan-400/15 font-mono text-xs">
          <span className="text-slate-400 text-[11px] px-2">Golden Ventilation: 13:30 - 15:30</span>
        </div>
      </div>

      <div className="relative h-64 w-full pt-4">
        <svg
          className="h-full w-full overflow-visible"
          viewBox="0 0 500 180"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="0" y1="165" x2="500" y2="165" stroke="#1e293b" />

          {/* Shaded Golden Window at 12:00 - 16:00 */}
          <rect x="250" y="20" width="85" height="145" fill="#34d399" opacity="0.12" rx="4" />
          <text x="255" y="40" fill="#34d399" fontSize="10" fontFamily="JetBrains Mono">
            Golden Air
          </text>

          <path d={areaD} fill="url(#curveGradient)" />
          <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2.5" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3" fill="#08101e" stroke="#22d3ee" strokeWidth="2" />
              <text
                x={p.x}
                y="178"
                fill="#94a3b8"
                fontSize="8"
                textAnchor="middle"
                fontFamily="JetBrains Mono"
              >
                {p.time}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-cyan-400/10 pt-2 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" /> Ground PM2.5 (µg/m³)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Optimal Window for Natural Air
          Exchange
        </span>
      </div>
    </div>
  );
}

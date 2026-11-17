import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { THIRTY_DAY_FORECAST } from '../data/airData';

export default function Forecast() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const selectedDay = THIRTY_DAY_FORECAST[selectedDayIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="08 · Predictive Telemetry"
        title="30-Day Urban Air Quality & Dispersion Forecast"
        desc="Calamity and smog-condition outlook blending CPCB, IMD, and WRF-Chem atmospheric feeds, delivered through integrity-checked data pipelines."
        right={
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Safe (&lt;150)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> High (151-280)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical (&gt;280)
            </span>
          </div>
        }
      />

      {/* 30-Day Calendar Matrix */}
      <div className="panel p-5 space-y-4">
        <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
          <div>
            <span className="label text-cyan-300">Meteorological Calendar</span>
            <h2 className="text-lg font-bold text-white">Atmospheric Hazard Horizon</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">WRF-Chem v4.3 Simulation</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-10">
          {THIRTY_DAY_FORECAST.map((item, idx) => {
            const isSelected = idx === selectedDayIndex;
            const cardColor =
              item.risk === 'Critical'
                ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
                : item.risk === 'High'
                  ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                  : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300';

            return (
              <button
                key={item.day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-2.5 rounded-lg border text-left font-mono transition cursor-pointer relative ${cardColor} ${
                  isSelected
                    ? 'ring-2 ring-cyan-300 scale-102 bg-cyan-400/20'
                    : 'hover:brightness-125'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-white">DAY {item.day}</span>
                  <span className="text-slate-400">{item.dateStr.split(' ')[0]}</span>
                </div>

                <div className="font-display text-lg font-bold text-white mt-1">{item.aqi}</div>

                <div className="text-[9px] uppercase font-bold truncate mt-0.5">{item.risk}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detailed Briefing & Atmospheric Chart */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left: Detailed Day Briefing Dossier */}
        <div className="panel panel-corners p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2">
            <span className="label text-cyan-300">Daily Forecast Briefing</span>
            <h2 className="text-xl font-bold text-white mt-0.5">{selectedDay.fullDate}</h2>
            <div className="font-mono text-xs text-slate-400 mt-1">
              Projected Atmospheric Stagnation Index · {selectedDay.grapStage}
            </div>
          </div>

          <div className="rounded-xl border border-cyan-400/15 bg-[#030712] p-4 text-center font-mono space-y-1">
            <div className="text-[10px] text-slate-400">EXPECTED BASIN AVERAGE AQI</div>
            <div className="font-display text-4xl font-extrabold text-white">{selectedDay.aqi}</div>
            <div className="text-xs text-cyan-300 font-bold">{selectedDay.peakPollutant}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="rounded-lg bg-[#030712] p-2.5 border border-cyan-400/10">
              <span className="text-slate-500 text-[10px]">Surface Wind:</span>
              <div className="font-bold text-white mt-0.5">{selectedDay.windSpeed} km/h</div>
            </div>
            <div className="rounded-lg bg-[#030712] p-2.5 border border-cyan-400/10">
              <span className="text-slate-500 text-[10px]">Inversion Height:</span>
              <div className="font-bold text-amber-300 mt-0.5">{selectedDay.inversionHeight} m</div>
            </div>
            <div className="rounded-lg bg-[#030712] p-2.5 border border-cyan-400/10">
              <span className="text-slate-500 text-[10px]">Temperature:</span>
              <div className="font-bold text-white mt-0.5">{selectedDay.temp} °C</div>
            </div>
            <div className="rounded-lg bg-[#030712] p-2.5 border border-cyan-400/10">
              <span className="text-slate-500 text-[10px]">Rain Chance:</span>
              <div className="font-bold text-cyan-300 mt-0.5">{selectedDay.rainChance} %</div>
            </div>
          </div>

          <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/10 space-y-1 text-xs">
            <div className="font-mono text-cyan-300 font-bold text-[11px]">
              Meteorological Analysis:
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">{selectedDay.briefing}</p>
          </div>
        </div>

        {/* Right: 30-Day AQI Progression Chart (2 Cols) */}
        <div className="panel p-5 xl:col-span-2 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
            <div>
              <span className="label text-cyan-300">Predictive Progression</span>
              <h2 className="text-lg font-bold text-white">
                30-Day Air Quality & Wind Velocity Trajectory
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="h-1.5 w-4 bg-cyan-400 rounded-full" /> Projected AQI
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="h-1.5 w-4 bg-amber-400 rounded-full" /> Wind Speed (km/h)
              </span>
            </div>
          </div>

          {/* Forecast Trend SVG Area Chart */}
          <div className="relative h-64 w-full pt-4">
            <svg
              className="h-full w-full overflow-visible"
              viewBox="0 0 600 180"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="35" x2="600" y2="35" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="125" x2="600" y2="125" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#1e293b" />

              {/* AQI Path */}
              {(() => {
                const points = THIRTY_DAY_FORECAST.map((item, i) => {
                  const x = (i / (THIRTY_DAY_FORECAST.length - 1)) * 600;
                  const y = 170 - (item.aqi / 450) * 140;
                  return { x, y };
                });

                const pathD = points.reduce(
                  (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                  ''
                );
                const areaD = `${pathD} L 600 170 L 0 170 Z`;

                // Wind line points
                const windPoints = THIRTY_DAY_FORECAST.map((item, i) => {
                  const x = (i / (THIRTY_DAY_FORECAST.length - 1)) * 600;
                  const y = 170 - (item.windSpeed / 15) * 80;
                  return { x, y };
                });
                const windPathD = windPoints.reduce(
                  (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                  ''
                );

                return (
                  <>
                    <path d={areaD} fill="url(#forecastGrad)" />
                    <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                    <path
                      d={windPathD}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                    />
                    {points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={idx === selectedDayIndex ? '5' : '2'}
                        fill={idx === selectedDayIndex ? '#f43f5e' : '#22d3ee'}
                        stroke="#030712"
                        strokeWidth="1.5"
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Time labels */}
            <div className="flex justify-between font-mono text-[9px] text-slate-500 pt-2">
              <span>Day 1 (Now)</span>
              <span>Day 6</span>
              <span>Day 12</span>
              <span>Day 18</span>
              <span>Day 24</span>
              <span>Day 30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

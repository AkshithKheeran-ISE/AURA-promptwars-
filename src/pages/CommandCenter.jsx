import React from 'react';
import {
  Wind,
  Thermometer,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Layers,
  Leaf,
  Users,
  Clock
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { WARDS_DATA, HOURLY_TRENDS } from '../data/airData';
import { FAMILY_ARCHETYPES } from '../services/routineEngine';

export default function CommandCenter() {
  const {
    setPage,
    selectedWard,
    setSelectedWardId,
    familyArchetype,
    setFamilyArchetype,
    exposureCalc,
    communitySavings,
    healthRisk,
    alerts,
    activeHacks,
    addToast
  } = useApp();

  const getAqiColor = (aqi) => {
    if (aqi <= 100) return '#34d399'; // Emerald
    if (aqi <= 200) return '#fbbf24'; // Amber
    if (aqi <= 300) return '#fb923c'; // Orange
    return '#f43f5e'; // Rose
  };

  const outdoorColor = getAqiColor(selectedWard.aqi);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="01 · Household Atmospheric Defense"
        title="Family & Community Smog Command Center"
        desc="Real-time boundary layer inversion tracking, indoor vs outdoor air quality telemetry, and explainable low-emission lifestyle guidance for urban households."
        right={
          <>
            <button
              onClick={() => setPage('routines')}
              className="flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-400/10 transition cursor-pointer"
            >
              <Clock className="h-3.5 w-3.5" />
              Smog Routines
            </button>
            <button
              onClick={() => setPage('hacks')}
              className="flex items-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-mono text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              DIY IAQ Hacks ({activeHacks.length} Active)
            </button>
            <button
              onClick={() => setPage('alternatives')}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-mono font-bold text-black shadow-glow hover:bg-cyan-300 transition cursor-pointer"
            >
              <Leaf className="h-3.5 w-3.5" />
              Clean Alternatives
            </button>
          </>
        }
      />

      {/* 6 Top Metric Cards specifically for Families */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        <div className="panel panel-corners p-4 space-y-1">
          <div className="flex items-center justify-between">
            <div className="label text-slate-400 truncate">Neighborhood Air Hazard</div>
            <span className="text-[9px] font-mono text-cyan-300 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">
              CAAQMS Baseline
            </span>
          </div>
          <div className="font-display text-2xl font-bold tracking-tight text-white flex items-baseline gap-2">
            AQI {selectedWard.aqi}
            <span className="text-xs font-mono font-bold" style={{ color: outdoorColor }}>
              {selectedWard.status}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">{selectedWard.name}</div>
        </div>

        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400 truncate">Indoor Inhaled Shield</div>
          <div className="font-display text-2xl font-bold tracking-tight text-emerald-400">
            -{exposureCalc.percentageReduction}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {exposureCalc.reductionMicrograms} µg PM2.5 avoided
          </div>
        </div>

        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400 truncate">Golden Ventilation Window</div>
          <div className="font-display text-2xl font-bold tracking-tight text-cyan-300">
            13:30 – 15:30
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Inversion breaks to 420m</div>
        </div>

        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400 truncate">Family Carbon Avoided</div>
          <div className="font-display text-2xl font-bold tracking-tight text-white">
            {communitySavings.co2SavedKg} kg
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">+12% vs last week</div>
        </div>

        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400 truncate">Active Community Alerts</div>
          <div className="font-display text-2xl font-bold tracking-tight text-rose-400">
            {alerts.length} Active
          </div>
          <div className="text-[10px] text-slate-400 font-mono">School & waste watches</div>
        </div>

        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400 truncate">Health & Fuel Savings</div>
          <div className="font-display text-2xl font-bold tracking-tight text-amber-300">
            ₹ {communitySavings.totalFinancialSavingsInr}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Direct household savings</div>
        </div>
      </div>

      {/* Household Profile Toolbar */}
      <div className="panel p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-cyan-400" /> Tailored Profile:
          </span>
          {FAMILY_ARCHETYPES.map((arch) => (
            <button
              key={arch.id}
              onClick={() => {
                setFamilyArchetype(arch.id);
                addToast(
                  'Profile Switched',
                  `Active calculations adjusted for ${arch.label}`,
                  'cyan'
                );
              }}
              className={`px-3 py-1 rounded-lg border transition cursor-pointer text-xs ${
                familyArchetype === arch.id
                  ? 'bg-cyan-400/20 border-cyan-400 text-cyan-200 font-bold'
                  : 'border-cyan-400/10 text-slate-400 hover:bg-white/5'
              }`}
            >
              {arch.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>Target Ward:</span>
          <select
            value={selectedWard.id}
            onChange={(e) => setSelectedWardId(e.target.value)}
            className="rounded-lg border border-cyan-400/20 bg-[#0c182c] px-2.5 py-1 text-white focus:outline-none"
          >
            {WARDS_DATA.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} (AQI {w.aqi})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Sector Matrix (Left) + Indoor vs Outdoor Telemetry (Right) */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left: Neighborhood Ward Matrix */}
        <div className="panel p-5 xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-400/10 pb-3">
            <div>
              <span className="label text-cyan-300">Neighborhood Smog Grid</span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Metropolitan Air Quality for Families
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Safe (&lt;100)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-400" /> Poor
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Severe (&gt;300)
              </span>
            </div>
          </div>

          {/* Wards Quick Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WARDS_DATA.map((w) => {
              const isSelected = selectedWard.id === w.id;
              const statusBg =
                w.status === 'Critical'
                  ? 'border-rose-500/40 bg-rose-500/5 hover:border-rose-500'
                  : w.status === 'High'
                    ? 'border-orange-500/40 bg-orange-500/5 hover:border-orange-500'
                    : w.status === 'Moderate'
                      ? 'border-amber-400/30 bg-amber-400/5 hover:border-amber-400'
                      : 'border-emerald-400/30 bg-emerald-400/5 hover:border-emerald-400';

              return (
                <button
                  key={w.id}
                  onClick={() => {
                    setSelectedWardId(w.id);
                    addToast('Ward Focused', `Active telemetry switched to ${w.name}`, 'cyan');
                  }}
                  className={`p-3 rounded-lg border text-left transition cursor-pointer relative overflow-hidden ${statusBg} ${
                    isSelected ? 'ring-1 ring-cyan-400 bg-cyan-400/10' : ''
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-cyan-400 rounded-bl" />
                  )}
                  <div className="text-xs font-semibold text-slate-200 truncate">{w.name}</div>
                  <div className="flex items-baseline justify-between mt-2 font-mono">
                    <span className="text-lg font-bold text-white">AQI {w.aqi}</span>
                    <span className="text-[10px] text-slate-400">{w.pm25} µg</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>
                      {w.wind} km/h {w.windDir}
                    </span>
                    <span className={w.status === 'Critical' ? 'text-rose-400 font-bold' : ''}>
                      {w.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-cyan-400/10 text-xs text-slate-400">
            <span>Showing 16 attested micro-sensor clusters · Delhi NCR Air Basin</span>
            <button
              onClick={() => setPage('map')}
              className="text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              Open Neighborhood Safe Corridors <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right: Indoor vs Outdoor Telemetry Comparison Card */}
        <div className="panel panel-corners p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2">
            <span className="label text-cyan-300">Indoor vs Outdoor Telemetry</span>
            <h2 className="text-lg font-bold text-white truncate">{selectedWard.name}</h2>
            <div className="font-mono text-xs text-slate-400">
              Protected by {activeHacks.length} DIY IAQ Hacks
            </div>
          </div>

          {/* Dual Readout Comparison */}
          <div className="grid grid-cols-2 gap-3 text-center font-mono">
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 space-y-0.5">
              <div className="text-[10px] text-rose-300 font-bold uppercase">OUTDOOR SMOG</div>
              <div className="font-display text-3xl font-extrabold text-rose-400">
                {selectedWard.aqi}
              </div>
              <div className="text-[10px] text-slate-400">{selectedWard.pm25} µg/m³ PM2.5</div>
              <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 font-bold">
                {selectedWard.status}
              </span>
            </div>

            <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/5 p-3 space-y-0.5">
              <div className="text-[10px] text-emerald-300 font-bold uppercase">
                INDOOR PROTECTED
              </div>
              <div className="font-display text-3xl font-extrabold text-emerald-400">
                {exposureCalc.indoorPm25}
              </div>
              <div className="text-[10px] text-slate-400">µg/m³ PM2.5 Inhaled</div>
              <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] bg-emerald-400/20 text-emerald-300 font-bold">
                SAFE ZONE
              </span>
            </div>
          </div>

          {/* Meteorological Readouts */}
          <div className="space-y-2 text-xs font-mono text-slate-300 border-t border-cyan-400/10 pt-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Thermometer className="h-3.5 w-3.5 text-cyan-400" /> Surface Temp
              </span>
              <span className="text-white font-bold">{selectedWard.temp} °C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Wind className="h-3.5 w-3.5 text-cyan-400" /> Dispersion Wind
              </span>
              <span className="text-white font-bold">
                {selectedWard.wind} km/h ({selectedWard.windDir})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Layers className="h-3.5 w-3.5 text-amber-400" /> Night Inversion Ceiling
              </span>
              <span className="text-amber-300 font-bold">{selectedWard.inversion}</span>
            </div>
          </div>

          {/* Health Vulnerability Shield Box */}
          <div className="rounded-lg border border-cyan-400/20 bg-[#030712] p-3 text-xs space-y-1">
            <div className="flex items-center justify-between font-mono">
              <span className="text-cyan-300 font-bold">Family Respiratory Shield:</span>
              <span className="text-emerald-400 font-bold">
                {healthRisk.respiratoryReliefPct}% Relief
              </span>
            </div>
            <p className="text-slate-300 text-[11px] font-sans leading-tight">
              Asthma flare-up probability minimized to {healthRisk.asthmaFlareUpProbability}%. Keep
              bedroom HEPA operational on silent mode overnight.
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Row: 24-Hour Diurnal Inversion Curve (Left) + Family Smog Playbook (Right) */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left: 24h Trend Chart */}
        <div className="panel p-5 xl:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/10 pb-3">
            <div>
              <span className="label text-cyan-300">Atmospheric Dynamics</span>
              <h2 className="text-lg font-bold text-white">
                24-Hour Diurnal Smog & Ventilation Curve
              </h2>
            </div>
            <div className="flex items-center gap-1 bg-[#030712] p-1 rounded-lg border border-cyan-400/15 font-mono text-xs">
              <span className="text-slate-400 text-[11px] px-2">
                Golden Ventilation: 13:30 - 15:30
              </span>
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

              {(() => {
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
                  <>
                    <path d={areaD} fill="url(#curveGradient)" />
                    <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                    {points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="#030712"
                        stroke="#22d3ee"
                        strokeWidth="2"
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            <div className="flex justify-between font-mono text-[10px] text-slate-500 pt-2">
              {HOURLY_TRENDS.map((t, idx) => (
                <span key={idx}>{t.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Family Emergency Checklist */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
            <div>
              <span className="label text-rose-400">Family Safeguards</span>
              <h2 className="text-lg font-bold text-white">Daily Smog Checklist</h2>
            </div>
            <span className="font-mono text-xs text-rose-300">Stage IV Active</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#030712] border border-cyan-400/15 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Corsi-Rosenthal Box Running</div>
                <div className="text-[10px] text-slate-400">92% particulate removal active</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#030712] border border-cyan-400/15 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Window Foam Weatherstripped</div>
                <div className="text-[10px] text-slate-400">Draft infiltration down to 25%</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#030712] border border-cyan-400/15 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Microfiber Wet-Mopping Only</div>
                <div className="text-[10px] text-slate-400">Dry sweeping strictly banned</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#030712] border border-cyan-400/15 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">N95 Mask Fit Tested for Children</div>
                <div className="text-[10px] text-slate-400">
                  Nasal bridge sealed with paper tape
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPage('hacks')}
            className="w-full text-center text-xs text-cyan-300 hover:underline pt-2 border-t border-cyan-400/10 cursor-pointer font-mono"
          >
            Explore All 6 Low-Cost IAQ Hacks &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

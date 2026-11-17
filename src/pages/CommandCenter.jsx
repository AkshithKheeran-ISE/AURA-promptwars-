import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Wind, 
  Thermometer, 
  Droplets, 
  Activity, 
  ExternalLink, 
  Zap, 
  CheckCircle2, 
  TrendingUp,
  Cpu,
  Layers,
  Factory
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { 
  WARDS_DATA, 
  TOP_STAT_METRICS, 
  HOURLY_TRENDS, 
  SYSTEM_HEALTH_METRICS,
  INDUSTRIAL_CEMS_STATIONS
} from '../data/airData';

export default function CommandCenter() {
  const { 
    setPage, 
    selectedWard, 
    setSelectedWardId, 
    alerts, 
    addToast 
  } = useApp();

  const [activePollutant, setActivePollutant] = useState('pm25');

  // Gauge color based on AQI
  const getAqiColor = (aqi) => {
    if (aqi <= 100) return '#34d399'; // Emerald
    if (aqi <= 200) return '#fbbf24'; // Amber
    if (aqi <= 300) return '#fb923c'; // Orange
    return '#f43f5e'; // Rose
  };

  const aqiColor = getAqiColor(selectedWard.aqi);

  // Circular gauge calculations (dasharray)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min(100, (selectedWard.aqi / 500) * 100);
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="01 · Atmospheric Intelligence"
        title="Urban Air Quality Command Center"
        desc="Real-time multi-sensor telemetry, satellite aerosol optical depth, and predictive machine learning models across urban wards."
        right={
          <>
            <button
              onClick={() => setPage('emissions')}
              className="flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-400/10 transition cursor-pointer"
            >
              <Factory className="h-3.5 w-3.5" />
              Emission Defense
            </button>
            <button
              onClick={() => setPage('alerts')}
              className="flex items-center gap-2 rounded-lg bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 text-xs font-mono text-rose-300 hover:bg-rose-500/30 transition cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Open Alert Center
            </button>
          </>
        }
      />

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        {TOP_STAT_METRICS.map((stat, idx) => (
          <div key={idx} className="panel panel-corners p-4 space-y-1">
            <div className="label text-slate-400 truncate">{stat.label}</div>
            <div className="font-display text-2xl font-bold tracking-tight text-white">
              {stat.value}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className={stat.good ? 'text-emerald-400' : 'text-rose-400'}>
                {stat.change}
              </span>
              <span className="text-slate-500 text-[10px] truncate">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Sector Matrix (Left) + Ward Detail Gauge (Right) */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left: Urban Intelligence Grid */}
        <div className="panel p-5 xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-400/10 pb-3">
            <div>
              <span className="label text-cyan-300">Spatial Monitoring Mesh</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Metropolitan Ward Telemetry Grid</h2>
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
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical (&gt;300)
              </span>
            </div>
          </div>

          {/* Wards Quick Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WARDS_DATA.map((w) => {
              const isSelected = selectedWard.id === w.id;
              const statusBg = 
                w.status === 'Critical' ? 'border-rose-500/40 bg-rose-500/5 hover:border-rose-500' :
                w.status === 'High' ? 'border-orange-500/40 bg-orange-500/5 hover:border-orange-500' :
                w.status === 'Moderate' ? 'border-amber-400/30 bg-amber-400/5 hover:border-amber-400' :
                'border-emerald-400/30 bg-emerald-400/5 hover:border-emerald-400';

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
                    <span>{w.wind} km/h {w.windDir}</span>
                    <span className={w.status === 'Critical' ? 'text-rose-400 font-bold' : ''}>{w.status}</span>
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
              Open Interactive Heatmap <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right: Regional Ward Telemetry Card */}
        <div className="panel panel-corners p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2">
            <span className="label text-cyan-300">Station Telemetry</span>
            <h2 className="text-lg font-bold text-white truncate">{selectedWard.name}</h2>
            <div className="font-mono text-xs text-slate-400">{selectedWard.sensorId} · {selectedWard.lat.toFixed(3)}°N, {selectedWard.lng.toFixed(3)}°E</div>
          </div>

          {/* Circular AQI Gauge */}
          <div className="flex items-center justify-center py-2">
            <div className="relative h-36 w-36 grid place-items-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-[#13233f]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={aqiColor}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-3xl font-bold text-white">
                  {selectedWard.aqi}
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold" style={{ color: aqiColor }}>
                  {selectedWard.status}
                </span>
                <span className="text-[9px] text-slate-500">AQI INDEX</span>
              </div>
            </div>
          </div>

          {/* Chemical Pollutant Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="rounded-lg bg-[#030712]/60 p-2 border border-cyan-400/10">
              <div className="text-[10px] text-slate-500">PM2.5</div>
              <div className="text-sm font-bold text-white mt-0.5">{selectedWard.pm25} <span className="text-[9px] text-slate-500">µg</span></div>
            </div>
            <div className="rounded-lg bg-[#030712]/60 p-2 border border-cyan-400/10">
              <div className="text-[10px] text-slate-500">PM10</div>
              <div className="text-sm font-bold text-white mt-0.5">{selectedWard.pm10} <span className="text-[9px] text-slate-500">µg</span></div>
            </div>
            <div className="rounded-lg bg-[#030712]/60 p-2 border border-cyan-400/10">
              <div className="text-[10px] text-slate-500">NO2</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">{selectedWard.no2} <span className="text-[9px] text-slate-500">ppb</span></div>
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
                <Wind className="h-3.5 w-3.5 text-cyan-400" /> Wind Velocity
              </span>
              <span className="text-white font-bold">{selectedWard.wind} km/h ({selectedWard.windDir})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Droplets className="h-3.5 w-3.5 text-cyan-400" /> Relative Humidity
              </span>
              <span className="text-white font-bold">{selectedWard.humidity} %</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Layers className="h-3.5 w-3.5 text-amber-400" /> Inversion Ceiling
              </span>
              <span className="text-amber-300 font-bold">{selectedWard.inversion}</span>
            </div>
          </div>

          {/* Node Integrity Verified Banner */}
          <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <div className="truncate">
              <div>Laser Particle Counter Attested</div>
              <div className="text-[9px] font-mono text-slate-500 font-normal">Ed25519 Sig · TPM 2.0 Hardened</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: 24-Hour Trend Chart (Left) + System Status Health (Right) */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left: 24h Trend Chart */}
        <div className="panel p-5 xl:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/10 pb-3">
            <div>
              <span className="label text-cyan-300">Diurnal Dynamics</span>
              <h2 className="text-lg font-bold text-white">24-Hour Pollutant Progression Curve</h2>
            </div>
            {/* Pollutant Tabs */}
            <div className="flex items-center gap-1 bg-[#030712] p-1 rounded-lg border border-cyan-400/15 font-mono text-xs">
              <button
                onClick={() => setActivePollutant('pm25')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  activePollutant === 'pm25' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                PM2.5
              </button>
              <button
                onClick={() => setActivePollutant('pm10')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  activePollutant === 'pm10' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                PM10
              </button>
              <button
                onClick={() => setActivePollutant('no2')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  activePollutant === 'no2' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                NO2
              </button>
              <button
                onClick={() => setActivePollutant('o3')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  activePollutant === 'o3' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                O3
              </button>
            </div>
          </div>

          {/* SVG Smooth Area Chart */}
          <div className="relative h-64 w-full pt-4">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="165" x2="500" y2="165" stroke="#1e293b" />

              {/* Render dynamic line according to activePollutant */}
              {(() => {
                const maxVal = activePollutant === 'pm10' ? 600 : activePollutant === 'pm25' ? 450 : 120;
                const points = HOURLY_TRENDS.map((pt, i) => {
                  const val = pt[activePollutant];
                  const x = (i / (HOURLY_TRENDS.length - 1)) * 500;
                  const y = 165 - (val / maxVal) * 135;
                  return { x, y, val, time: pt.time };
                });

                const pathD = points.reduce((acc, p, i) => 
                  i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, ''
                );
                const areaD = `${pathD} L 500 165 L 0 165 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#curveGradient)" />
                    <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                    {points.map((p, idx) => (
                      <g key={idx} className="group">
                        <circle cx={p.x} cy={p.y} r="3.5" fill="#030712" stroke="#22d3ee" strokeWidth="2" />
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Time Axis Labels */}
            <div className="flex justify-between font-mono text-[10px] text-slate-500 pt-2">
              {HOURLY_TRENDS.map((t, idx) => (
                <span key={idx}>{t.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Ingestion & Model Health */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
            <div>
              <span className="label text-cyan-300">Telemetry Health</span>
              <h2 className="text-lg font-bold text-white">System Infrastructure</h2>
            </div>
            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ALL SYSTEMS OPERATIONAL
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {SYSTEM_HEALTH_METRICS.map((sys, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="truncate">{sys.name}</span>
                  <span className="text-cyan-300 font-bold">{sys.load}</span>
                </div>
                <div className="h-1.5 w-full bg-[#030712] rounded-full overflow-hidden border border-cyan-400/10">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                    style={{ width: sys.load }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Latency: {sys.latency}</span>
                  <span className="text-emerald-400 font-bold">{sys.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/10 font-mono text-xs space-y-1">
            <div className="text-cyan-300 font-bold">Edge Attestation Certificate</div>
            <div className="text-[10px] text-slate-500 truncate">SHA256: 8f921a8b74c20193e8471920394857201938</div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Priority Alerts (Left) + Top Offending Sources Table (Right) */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left: Priority Alerts */}
        <div className="panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-400/10 pb-3">
            <div>
              <span className="label text-rose-400">Emergency Queue</span>
              <h2 className="text-lg font-bold text-white">Active Environmental Incidents</h2>
            </div>
            <button
              onClick={() => setPage('alerts')}
              className="text-xs text-cyan-300 hover:underline font-mono cursor-pointer"
            >
              View all ({alerts.length}) &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 3).map((alr) => (
              <div 
                key={alr.id} 
                className="flex items-start justify-between gap-3 p-3 rounded-lg border border-cyan-400/10 bg-[#030712]/50 hover:bg-white/5 transition"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-400">{alr.id}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-semibold text-white truncate">{alr.title}</span>
                  </div>
                  <div className="text-xs text-slate-400 truncate">{alr.ward} · {alr.source}</div>
                  <div className="text-[10px] font-mono text-amber-300">{alr.exceedance}</div>
                </div>

                <button
                  onClick={() => setPage('alerts')}
                  className="rounded-lg bg-cyan-400/10 border border-cyan-400/30 px-3 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-400/20 transition cursor-pointer shrink-0"
                >
                  Investigate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Industrial CEMS Stack Offenders */}
        <div className="panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-400/10 pb-3">
            <div>
              <span className="label text-amber-400">Point Source Telemetry</span>
              <h2 className="text-lg font-bold text-white">Continuous Stack Emission (CEMS)</h2>
            </div>
            <button
              onClick={() => setPage('emissions')}
              className="text-xs text-cyan-300 hover:underline font-mono cursor-pointer"
            >
              Full Defense Matrix &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyan-400/10 text-slate-500">
                  <th className="pb-2 font-normal">Stack Unit</th>
                  <th className="pb-2 font-normal">Pollutant</th>
                  <th className="pb-2 font-normal">Recorded vs Limit</th>
                  <th className="pb-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-400/5">
                {INDUSTRIAL_CEMS_STATIONS.slice(0, 4).map((cems) => (
                  <tr key={cems.id} className="hover:bg-white/5 transition">
                    <td className="py-2.5 text-cyan-300 font-bold">{cems.id}</td>
                    <td className="py-2.5 text-slate-300">{cems.pollutant}</td>
                    <td className="py-2.5 text-white">
                      {cems.actual} <span className="text-slate-500">/ {cems.limit}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        cems.status.includes('VIOLATION') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        cems.status.includes('TAMPER') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {cems.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

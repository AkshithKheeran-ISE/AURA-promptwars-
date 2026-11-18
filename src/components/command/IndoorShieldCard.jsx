import React from 'react';
import PropTypes from 'prop-types';
import { Thermometer, Wind, Layers } from 'lucide-react';

/**
 * Dual indoor vs outdoor telemetry and micro-climate meteorological metrics.
 */
export default function IndoorShieldCard({
  selectedWard,
  exposureCalc,
  activeHacksCount,
  healthRisk
}) {
  return (
    <div className="panel panel-corners p-5 space-y-4">
      <div className="border-b border-cyan-400/10 pb-2">
        <span className="label text-cyan-300">Indoor vs Outdoor Telemetry</span>
        <h2 className="text-lg font-bold text-white truncate">{selectedWard.name}</h2>
        <div className="font-mono text-xs text-slate-400">
          Protected by {activeHacksCount} DIY IAQ Hacks
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
          <div className="text-[10px] text-emerald-300 font-bold uppercase">INDOOR PROTECTED</div>
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
  );
}

IndoorShieldCard.propTypes = {
  selectedWard: PropTypes.object.isRequired,
  exposureCalc: PropTypes.object.isRequired,
  activeHacksCount: PropTypes.number.isRequired,
  healthRisk: PropTypes.object.isRequired
};

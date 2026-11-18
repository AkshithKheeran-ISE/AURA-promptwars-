import React from 'react';
import PropTypes from 'prop-types';

/**
 * Top 6 executive household metric cards for the Smog Command Center.
 */
export default function FamilyMetricCards({
  selectedWard,
  outdoorColor,
  exposureCalc,
  communitySavings,
  alertsCount
}) {
  return (
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
          {alertsCount} Active
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
  );
}

FamilyMetricCards.propTypes = {
  selectedWard: PropTypes.object.isRequired,
  outdoorColor: PropTypes.string.isRequired,
  exposureCalc: PropTypes.object.isRequired,
  communitySavings: PropTypes.object.isRequired,
  alertsCount: PropTypes.number.isRequired
};

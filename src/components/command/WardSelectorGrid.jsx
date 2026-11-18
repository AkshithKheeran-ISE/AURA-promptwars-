import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLink } from 'lucide-react';
import { WARDS_DATA } from '../../data/airData';

const WARD_STATUS_CLASSES = {
  Critical: 'border-rose-500/40 bg-rose-500/5 hover:border-rose-500',
  High: 'border-orange-500/40 bg-orange-500/5 hover:border-orange-500',
  Moderate: 'border-amber-400/30 bg-amber-400/5 hover:border-amber-400',
  Low: 'border-emerald-400/30 bg-emerald-400/5 hover:border-emerald-400'
};
const DEFAULT_WARD_STATUS_CLASS = 'border-emerald-400/30 bg-emerald-400/5 hover:border-emerald-400';

/**
 * 16-ward neighborhood grid with live telemetry and selection triggers.
 */
export default function WardSelectorGrid({ selectedWard, onSelectWard, onNavigateMap }) {
  return (
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
          const statusBg = WARD_STATUS_CLASSES[w.status] || DEFAULT_WARD_STATUS_CLASS;

          return (
            <button
              key={w.id}
              onClick={() => onSelectWard(w)}
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
          onClick={onNavigateMap}
          className="text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer font-mono"
        >
          Open Neighborhood Safe Corridors <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

WardSelectorGrid.propTypes = {
  selectedWard: PropTypes.object.isRequired,
  onSelectWard: PropTypes.func.isRequired,
  onNavigateMap: PropTypes.func.isRequired
};

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Granular chemical and particulate telemetry metrics display for a selected sector.
 */
export default function SectorTelemetryGrid({ selectedWard }) {
  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="flex justify-between py-1.5 border-b border-cyan-400/10">
        <span className="text-slate-400">Fine Particulates (PM2.5):</span>
        <span className="font-bold text-white">{selectedWard.pm25} µg/m³</span>
      </div>
      <div className="flex justify-between py-1.5 border-b border-cyan-400/10">
        <span className="text-slate-400">Coarse Dust (PM10):</span>
        <span className="font-bold text-white">{selectedWard.pm10} µg/m³</span>
      </div>
      <div className="flex justify-between py-1.5 border-b border-cyan-400/10">
        <span className="text-slate-400">Nitrogen Dioxide (NO2):</span>
        <span className="font-bold text-cyan-300">{selectedWard.no2} ppb</span>
      </div>
      <div className="flex justify-between py-1.5 border-b border-cyan-400/10">
        <span className="text-slate-400">Sulfur Dioxide (SO2):</span>
        <span className="font-bold text-amber-300">{selectedWard.so2} ppb</span>
      </div>
      <div className="flex justify-between py-1.5 border-b border-cyan-400/10">
        <span className="text-slate-400">Carbon Monoxide (CO):</span>
        <span className="font-bold text-white">{selectedWard.co} mg/m³</span>
      </div>
      <div className="flex justify-between py-1.5 border-b border-cyan-400/10">
        <span className="text-slate-400">Ground-Level Ozone (O3):</span>
        <span className="font-bold text-white">{selectedWard.o3} ppb</span>
      </div>
    </div>
  );
}

SectorTelemetryGrid.propTypes = {
  selectedWard: PropTypes.shape({
    pm25: PropTypes.number.isRequired,
    pm10: PropTypes.number.isRequired,
    no2: PropTypes.number.isRequired,
    so2: PropTypes.number.isRequired,
    co: PropTypes.number.isRequired,
    o3: PropTypes.number.isRequired
  }).isRequired
};

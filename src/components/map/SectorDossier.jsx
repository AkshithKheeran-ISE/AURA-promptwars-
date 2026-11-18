import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import SectorTelemetryGrid from './SectorTelemetryGrid';

/**
 * Detailed inspector dossier for the currently selected spatial sector.
 */
export default function SectorDossier({ selectedWard, statusColor }) {
  const isCritical = selectedWard.status === 'Critical';

  return (
    <div className="panel panel-corners p-5 space-y-4">
      <div className="border-b border-cyan-400/10 pb-3">
        <span className="label text-cyan-300">Sector Dossier</span>
        <h2 className="text-xl font-bold text-white mt-0.5">{selectedWard.name}</h2>
        <div className="font-mono text-xs text-slate-400 mt-1">
          Station {selectedWard.sensorId} · {selectedWard.lat.toFixed(3)}°N,{' '}
          {selectedWard.lng.toFixed(3)}°E
        </div>
      </div>

      {/* Big AQI Status Display */}
      <div className="rounded-xl border border-cyan-400/15 bg-[#030712]/70 p-4 text-center space-y-1">
        <div className="font-mono text-[11px] text-slate-400">INSTANTANEOUS AIR QUALITY INDEX</div>
        <div className="font-display text-4xl font-extrabold" style={{ color: statusColor }}>
          {selectedWard.aqi}
        </div>
        <div
          className="inline-block px-2.5 py-0.5 rounded font-mono text-xs font-bold uppercase tracking-widest"
          style={{
            backgroundColor: isCritical ? 'rgba(244,63,94,0.15)' : 'rgba(52,211,153,0.15)',
            color: isCritical ? '#f43f5e' : '#34d399'
          }}
        >
          {selectedWard.status} HAZARD LEVEL
        </div>
      </div>

      {/* Granular Chemical Telemetry */}
      <SectorTelemetryGrid selectedWard={selectedWard} />

      {/* Primary Emission Contributors */}
      <div className="space-y-1.5">
        <span className="label text-slate-400">Primary Source Fingerprints</span>
        <div className="space-y-1">
          {selectedWard.sources.map((src, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded bg-[#030712] p-2 text-xs text-slate-300 font-mono border border-cyan-400/10"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>{src}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inversion Boundary Warning */}
      <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono">
          <AlertTriangle className="h-3.5 w-3.5" />
          Atmospheric Inversion Risk
        </div>
        <div className="text-xs text-slate-300 leading-snug">
          Thermal ceiling trapped at {selectedWard.inversion}. Stagnant surface winds preventing
          dispersion of heavy combustion aerosols.
        </div>
      </div>
    </div>
  );
}

SectorDossier.propTypes = {
  selectedWard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    aqi: PropTypes.number.isRequired,
    pm25: PropTypes.number.isRequired,
    pm10: PropTypes.number.isRequired,
    no2: PropTypes.number.isRequired,
    so2: PropTypes.number.isRequired,
    co: PropTypes.number.isRequired,
    o3: PropTypes.number.isRequired,
    inversion: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    sensorId: PropTypes.string.isRequired,
    sources: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  statusColor: PropTypes.string.isRequired
};

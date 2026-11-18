import React from 'react';
import PropTypes from 'prop-types';
import { Layers } from 'lucide-react';

/**
 * Tactical atmospheric layer toggles for the GIS telemetry map.
 */
export default function MapLayersToolbar({ layers, onToggleLayer }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/10 pb-2.5 px-2">
      <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
        <Layers className="h-4 w-4 text-cyan-400" />
        <span className="font-bold text-white">Atmospheric Layers:</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
        <label
          htmlFor="layer-sensors"
          className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white"
        >
          <input
            id="layer-sensors"
            type="checkbox"
            checked={layers.sensors}
            onChange={() => onToggleLayer('sensors')}
            className="accent-cyan-400 cursor-pointer"
          />
          <span>Micro-Sensors</span>
        </label>

        <label
          htmlFor="layer-plumes"
          className="flex items-center gap-1.5 cursor-pointer text-rose-300 hover:text-white"
        >
          <input
            id="layer-plumes"
            type="checkbox"
            checked={layers.plumes}
            onChange={() => onToggleLayer('plumes')}
            className="accent-rose-500 cursor-pointer"
          />
          <span>Industrial Plumes</span>
        </label>

        <label
          htmlFor="layer-traffic"
          className="flex items-center gap-1.5 cursor-pointer text-amber-300 hover:text-white"
        >
          <input
            id="layer-traffic"
            type="checkbox"
            checked={layers.traffic}
            onChange={() => onToggleLayer('traffic')}
            className="accent-amber-400 cursor-pointer"
          />
          <span>Freight Corridors</span>
        </label>

        <label
          htmlFor="layer-sensitive"
          className="flex items-center gap-1.5 cursor-pointer text-emerald-300 hover:text-white"
        >
          <input
            id="layer-sensitive"
            type="checkbox"
            checked={layers.sensitive}
            onChange={() => onToggleLayer('sensitive')}
            className="accent-emerald-400 cursor-pointer"
          />
          <span>School Zones</span>
        </label>
      </div>
    </div>
  );
}

MapLayersToolbar.propTypes = {
  layers: PropTypes.shape({
    sensors: PropTypes.bool.isRequired,
    plumes: PropTypes.bool.isRequired,
    traffic: PropTypes.bool.isRequired,
    sensitive: PropTypes.bool.isRequired
  }).isRequired,
  onToggleLayer: PropTypes.func.isRequired
};

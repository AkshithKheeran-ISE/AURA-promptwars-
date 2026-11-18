import React from 'react';
import { Compass } from 'lucide-react';

/**
 * Tactical floating overlays for the GIS telemetry map (compass & AQI legend).
 */
export default function MapTacticalOverlays() {
  return (
    <>
      {/* Tactical Map Floating Overlay */}
      <div className="absolute top-3 left-3 z-[400] panel p-2.5 font-mono text-[11px] space-y-1 bg-[#08101e]/90 shadow-xl">
        <div className="text-cyan-300 font-bold flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '10s' }} />
          <span>DELHI NCR BASIN · GRID-4</span>
        </div>
        <div className="text-slate-400 text-[10px]">Lat 28.6138° N · Long 77.2090° E</div>
        <div className="text-emerald-400 text-[10px] flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>CPCB Delhi CAAQMS Baseline</span>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 right-3 z-[400] panel p-2 font-mono text-[10px] space-y-1 bg-[#08101e]/90 shadow-xl">
        <div className="text-slate-400 font-bold mb-1">AIR QUALITY INDEX</div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-slate-300">0 - 100 Good/Satisfactory</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-slate-300">101 - 200 Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          <span className="text-slate-300">201 - 300 Poor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span className="text-slate-300">301+ Severe / Emergency</span>
        </div>
      </div>
    </>
  );
}

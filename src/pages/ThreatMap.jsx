import React, { useRef, useState } from 'react';
import { LocateFixed, MapPin } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import MapLayersToolbar from '../components/map/MapLayersToolbar';
import MapTacticalOverlays from '../components/map/MapTacticalOverlays';
import SectorDossier from '../components/map/SectorDossier';
import { useHousehold, useUi } from '../context/AppContext';
import { useThreatMapLeaflet } from '../hooks/useThreatMapLeaflet';

/**
 * Interactive spatial radar map displaying pollution plumes, sensors, and sensitive receptors.
 */
export default function ThreatMap() {
  const { selectedWard, setSelectedWardId } = useHousehold();
  const { addToast } = useUi();
  const mapContainerRef = useRef(null);

  const [layers, setLayers] = useState({
    sensors: true,
    plumes: true,
    traffic: true,
    sensitive: true,
    windFlow: true
  });

  const toggleLayer = (layerKey) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const { resetIndiaView, locateMe } = useThreatMapLeaflet(
    mapContainerRef,
    selectedWard,
    setSelectedWardId,
    addToast,
    layers
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="05 · Spatial Hazard Radar"
        title="Urban Air Basin Threat Map"
        desc="Real-time multi-layered geographical representation of air pollution plumes, traffic canyons, sensitive receptors, and continuous industrial monitoring stacks."
      />

      <MapLayersToolbar layers={layers} onToggleLayer={toggleLayer} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="panel p-2 xl:col-span-2 relative min-h-[540px] overflow-hidden">
          <div ref={mapContainerRef} className="aura-map h-[540px] w-full rounded-xl z-0" />
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              type="button"
              onClick={locateMe}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-[#030712]/90 px-3 py-1.5 font-mono text-[11px] font-bold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              <LocateFixed className="h-3.5 w-3.5" /> My location
            </button>
            <button
              type="button"
              onClick={resetIndiaView}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-[#030712]/90 px-3 py-1.5 font-mono text-[11px] font-bold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              <MapPin className="h-3.5 w-3.5" /> View all of India
            </button>
          </div>
          <MapTacticalOverlays />
        </div>
        <SectorDossier
          selectedWard={selectedWard}
          statusColor={selectedWard.status === 'Critical' ? '#f43f5e' : '#34d399'}
        />
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
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

  useThreatMapLeaflet(mapContainerRef, selectedWard, setSelectedWardId, addToast, layers);

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
          <div ref={mapContainerRef} className="h-[540px] w-full rounded-xl z-0" />
          <MapTacticalOverlays layers={layers} />
        </div>
        <SectorDossier selectedWard={selectedWard} />
      </div>
    </div>
  );
}

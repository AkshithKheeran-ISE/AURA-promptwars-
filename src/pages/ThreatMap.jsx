import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Wind, 
  Thermometer, 
  Droplets, 
  Activity,
  Compass,
  Zap
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { WARDS_DATA } from '../data/airData';

export default function ThreatMap() {
  const { 
    selectedWard, 
    setSelectedWardId, 
    alerts, 
    addToast 
  } = useApp();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Layer toggles
  const [layers, setLayers] = useState({
    sensors: true,
    plumes: true,
    traffic: true,
    sensitive: true,
    windFlow: true
  });

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Delhi urban basin
    const map = L.map(mapContainerRef.current, {
      center: [28.63, 77.20],
      zoom: 11,
      zoomControl: true,
      attributionControl: false
    });

    // Dark tactical CartoDB tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers when wards or selected ward changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    if (!layers.sensors) return;

    WARDS_DATA.forEach(ward => {
      const isSelected = selectedWard.id === ward.id;
      const color = 
        ward.status === 'Critical' ? '#f43f5e' :
        ward.status === 'High' ? '#fb923c' :
        ward.status === 'Moderate' ? '#fbbf24' : '#34d399';

      const customIcon = L.divIcon({
        className: 'aura-marker',
        html: `
          <div class="ring" style="background-color: ${color}; opacity: ${isSelected ? '0.9' : '0.4'};"></div>
          <div class="dot" style="background-color: ${color}; border-color: ${isSelected ? '#ffffff' : '#030712'}; width: 14px; height: 14px;"></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([ward.lat, ward.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <div style="font-weight: bold; color: #22d3ee; margin-bottom: 4px;">${ward.name}</div>
          <div style="color: #ffffff; margin-bottom: 2px;">AQI: <strong style="color: ${color}; font-size: 13px;">${ward.aqi}</strong> (${ward.status})</div>
          <div style="color: #94a3b8;">PM2.5: ${ward.pm25} µg/m³ · NO2: ${ward.no2} ppb</div>
          <div style="color: #64748b; font-size: 9px; margin-top: 4px;">Sensor ID: ${ward.sensorId}</div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedWardId(ward.id);
        addToast('Sensor Selected', `Focused on ${ward.name} · AQI ${ward.aqi}`, 'cyan');
      });

      markersRef.current[ward.id] = marker;
    });

    // Draw simulated traffic emission corridor lines if toggled
    if (layers.traffic) {
      // Ring Road Corridor
      const ringRoad = [
        [28.73, 77.12],
        [28.67, 77.12],
        [28.63, 77.11],
        [28.53, 77.16],
        [28.53, 77.27],
        [28.61, 77.26],
        [28.70, 77.17]
      ];
      const trafficLine = L.polyline(ringRoad, {
        color: '#f43f5e',
        weight: 2.5,
        dashArray: '6 8',
        opacity: 0.65
      }).addTo(map);
      markersRef.current['traffic_line'] = trafficLine;
    }

    // Draw simulated industrial smoke plume zones if toggled
    if (layers.plumes) {
      const plumeWards = WARDS_DATA.filter(w => w.status === 'Critical');
      plumeWards.forEach(w => {
        const circle = L.circle([w.lat, w.lng], {
          color: '#f43f5e',
          fillColor: '#f43f5e',
          fillOpacity: 0.18,
          radius: 1800,
          weight: 1,
          dashArray: '4 4'
        }).addTo(map);
        markersRef.current[`plume_${w.id}`] = circle;
      });
    }

  }, [selectedWard.id, layers, setSelectedWardId, addToast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="02 · Spatial Telemetry"
        title="Urban AQI Threat Heatmap & Sensor Mesh"
        desc="Satellite imagery fused with IoT micro-sensor telemetry, traffic congestion corridors, and industrial emission plumes mapped in real time."
        right={
          <div className="flex items-center gap-2">
            <span className="rounded border border-cyan-400/30 bg-[#0c182c] px-3 py-1 font-mono text-xs text-cyan-300">
              3,420 IoT Nodes Online
            </span>
            <span className="rounded border border-rose-500/40 bg-rose-500/10 px-3 py-1 font-mono text-xs text-rose-300">
              6 Severe Plumes
            </span>
          </div>
        }
      />

      {/* Main Map & Detail Layout */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Map Viewport Container (col-span-2) */}
        <div className="panel p-3 xl:col-span-2 space-y-3 relative overflow-hidden">
          {/* Map Header Toolbar with Layer Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/10 pb-2.5 px-2">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-white">Atmospheric Layers:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <label htmlFor="layer-sensors" className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  id="layer-sensors"
                  type="checkbox"
                  checked={layers.sensors}
                  onChange={() => toggleLayer('sensors')}
                  className="accent-cyan-400 cursor-pointer"
                />
                <span>Micro-Sensors</span>
              </label>

              <label htmlFor="layer-plumes" className="flex items-center gap-1.5 cursor-pointer text-rose-300 hover:text-white">
                <input
                  id="layer-plumes"
                  type="checkbox"
                  checked={layers.plumes}
                  onChange={() => toggleLayer('plumes')}
                  className="accent-rose-500 cursor-pointer"
                />
                <span>Industrial Plumes</span>
              </label>

              <label htmlFor="layer-traffic" className="flex items-center gap-1.5 cursor-pointer text-amber-300 hover:text-white">
                <input
                  id="layer-traffic"
                  type="checkbox"
                  checked={layers.traffic}
                  onChange={() => toggleLayer('traffic')}
                  className="accent-amber-400 cursor-pointer"
                />
                <span>Freight Corridors</span>
              </label>

              <label htmlFor="layer-sensitive" className="flex items-center gap-1.5 cursor-pointer text-emerald-300 hover:text-white">
                <input
                  id="layer-sensitive"
                  type="checkbox"
                  checked={layers.sensitive}
                  onChange={() => toggleLayer('sensitive')}
                  className="accent-emerald-400 cursor-pointer"
                />
                <span>School Zones</span>
              </label>
            </div>
          </div>

          {/* Leaflet DOM Map Container */}
          <div className="aura-map relative h-[560px] w-full rounded-lg overflow-hidden border border-cyan-400/15">
            <div ref={mapContainerRef} className="h-full w-full" />

            {/* Tactical Map Floating Overlay */}
            <div className="absolute top-3 left-3 z-[400] panel p-2.5 font-mono text-[11px] space-y-1 bg-[#08101e]/90 shadow-xl">
              <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                <span>DELHI NCR BASIN · GRID-4</span>
              </div>
              <div className="text-slate-400 text-[10px]">
                Lat 28.6138° N · Long 77.2090° E
              </div>
              <div className="text-emerald-400 text-[10px] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>INSAT-3DR Downlink Synced</span>
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
          </div>
        </div>

        {/* Selected Sector Inspector Panel (Right) */}
        <div className="panel panel-corners p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-3">
            <span className="label text-cyan-300">Sector Dossier</span>
            <h2 className="text-xl font-bold text-white mt-0.5">{selectedWard.name}</h2>
            <div className="font-mono text-xs text-slate-400 mt-1">
              Station {selectedWard.sensorId} · {selectedWard.lat.toFixed(3)}°N, {selectedWard.lng.toFixed(3)}°E
            </div>
          </div>

          {/* Big AQI Status Display */}
          <div className="rounded-xl border border-cyan-400/15 bg-[#030712]/70 p-4 text-center space-y-1">
            <div className="font-mono text-[11px] text-slate-400">INSTANTANEOUS AIR QUALITY INDEX</div>
            <div className="font-display text-4xl font-extrabold" style={{ 
              color: selectedWard.status === 'Critical' ? '#f43f5e' : selectedWard.status === 'High' ? '#fb923c' : selectedWard.status === 'Moderate' ? '#fbbf24' : '#34d399'
            }}>
              {selectedWard.aqi}
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded font-mono text-xs font-bold uppercase tracking-widest" style={{
              backgroundColor: selectedWard.status === 'Critical' ? 'rgba(244,63,94,0.15)' : 'rgba(52,211,153,0.15)',
              color: selectedWard.status === 'Critical' ? '#f43f5e' : '#34d399'
            }}>
              {selectedWard.status} HAZARD LEVEL
            </div>
          </div>

          {/* Granular Chemical Telemetry */}
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

          {/* Primary Emission Contributors */}
          <div className="space-y-1.5">
            <span className="label text-slate-400">Primary Source Fingerprints</span>
            <div className="space-y-1">
              {selectedWard.sources.map((src, i) => (
                <div key={i} className="flex items-center gap-2 rounded bg-[#030712] p-2 text-xs text-slate-300 font-mono border border-cyan-400/10">
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
              Thermal ceiling trapped at {selectedWard.inversion}. Stagnant surface winds preventing dispersion of heavy combustion aerosols.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

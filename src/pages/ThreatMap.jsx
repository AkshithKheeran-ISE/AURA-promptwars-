import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import SectionHeader from '../components/SectionHeader';
import MapLayersToolbar from '../components/map/MapLayersToolbar';
import MapTacticalOverlays from '../components/map/MapTacticalOverlays';
import SectorDossier from '../components/map/SectorDossier';
import { useApp } from '../context/AppContext';
import { WARDS_DATA } from '../data/airData';

const STATUS_COLORS = {
  Critical: '#f43f5e',
  High: '#fb923c',
  Moderate: '#fbbf24',
  Low: '#34d399'
};
const DEFAULT_STATUS_COLOR = '#34d399';

function getStatusColor(status) {
  return STATUS_COLORS[status] || DEFAULT_STATUS_COLOR;
}

const RING_ROAD_CORRIDOR = [
  [28.73, 77.12],
  [28.67, 77.12],
  [28.63, 77.11],
  [28.53, 77.16],
  [28.53, 77.27],
  [28.61, 77.26],
  [28.7, 77.17]
];

export default function ThreatMap() {
  const { selectedWard, setSelectedWardId, addToast } = useApp();

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
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Delhi urban basin
    const map = L.map(mapContainerRef.current, {
      center: [28.63, 77.2],
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
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    if (!layers.sensors) return;

    WARDS_DATA.forEach((ward) => {
      const isSelected = selectedWard.id === ward.id;
      const color = getStatusColor(ward.status);

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
      const trafficLine = L.polyline(RING_ROAD_CORRIDOR, {
        color: '#f43f5e',
        weight: 2.5,
        dashArray: '6 8',
        opacity: 0.65
      }).addTo(map);
      markersRef.current['traffic_line'] = trafficLine;
    }

    // Draw simulated industrial smoke plume zones if toggled
    if (layers.plumes) {
      const plumeWards = WARDS_DATA.filter((w) => w.status === 'Critical');
      plumeWards.forEach((w) => {
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
        desc="Geospatial visualization of Delhi CAAQMS monitoring stations, traffic corridors, and industrial emission hotspots mapped with interactive tactical filters."
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
          <MapLayersToolbar layers={layers} onToggleLayer={toggleLayer} />

          {/* Leaflet DOM Map Container */}
          <div className="aura-map relative h-[560px] w-full rounded-lg overflow-hidden border border-cyan-400/15">
            <div ref={mapContainerRef} className="h-full w-full" />
            <MapTacticalOverlays />
          </div>
        </div>

        {/* Selected Sector Inspector Panel (Right) */}
        <SectorDossier
          selectedWard={selectedWard}
          statusColor={getStatusColor(selectedWard.status)}
        />
      </div>
    </div>
  );
}

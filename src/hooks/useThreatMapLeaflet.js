import { useEffect, useRef } from 'react';
import L from 'leaflet';
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

function createWardMarker(ward, isSelected, onSelect) {
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

  const marker = L.marker([ward.lat, ward.lng], { icon: customIcon });
  marker.bindPopup(`
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
      <div style="font-weight: bold; color: #22d3ee; margin-bottom: 4px;">${ward.name}</div>
      <div style="color: #ffffff; margin-bottom: 2px;">AQI: <strong style="color: ${color}; font-size: 13px;">${ward.aqi}</strong> (${ward.status})</div>
      <div style="color: #94a3b8;">PM2.5: ${ward.pm25} µg/m³ · NO2: ${ward.no2} ppb</div>
      <div style="color: #64748b; font-size: 9px; margin-top: 4px;">Sensor ID: ${ward.sensorId}</div>
    </div>
  `);
  marker.on('click', onSelect);
  return marker;
}

/**
 * Manages Leaflet map initialization, tactical overlays, and sensor markers.
 */
export function useThreatMapLeaflet(
  mapContainerRef,
  selectedWard,
  setSelectedWardId,
  addToast,
  layers
) {
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28.63, 77.2],
      zoom: 11,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapContainerRef]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    if (layers.sensors) {
      WARDS_DATA.forEach((ward) => {
        const marker = createWardMarker(ward, selectedWard.id === ward.id, () => {
          setSelectedWardId(ward.id);
          addToast('Sensor Selected', `Focused on ${ward.name} · AQI ${ward.aqi}`, 'cyan');
        });
        marker.addTo(map);
        markersRef.current[ward.id] = marker;
      });
    }

    if (layers.traffic) {
      markersRef.current['traffic_line'] = L.polyline(RING_ROAD_CORRIDOR, {
        color: '#f43f5e',
        weight: 2.5,
        dashArray: '6 8',
        opacity: 0.65
      }).addTo(map);
    }

    if (layers.plumes) {
      WARDS_DATA.filter((w) => w.status === 'Critical').forEach((w) => {
        markersRef.current[`plume_${w.id}`] = L.circle([w.lat, w.lng], {
          color: '#f43f5e',
          fillColor: '#f43f5e',
          fillOpacity: 0.15,
          radius: 3500,
          weight: 1
        }).addTo(map);
      });
    }
  }, [selectedWard, setSelectedWardId, addToast, layers]);
}

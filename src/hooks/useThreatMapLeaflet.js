import { useCallback, useEffect, useRef } from 'react';
import L from 'leaflet';
import { INDIA_CITIES, INDIA_VIEW, WARDS_DATA } from '../data/airData';

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

/**
 * Free basemap with no API key. CARTO's dark tiles started returning
 * "API KEY REQUIRED" watermark tiles, so the map background was unreadable.
 * OpenStreetMap tiles need no key — only attribution, which Leaflet shows
 * because attributionControl is on. The existing `.aura-map` CSS darkens
 * the light tiles to match the app's dark theme.
 */
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

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

  const marker = L.marker([ward.lat, ward.lng], {
    icon: customIcon,
    title: `${ward.name} Air Quality Monitoring Station`,
    alt: `${ward.name} Air Quality Monitoring Station`
  });
  marker.on('add', () => {
    const el = marker.getElement();
    if (el) {
      el.setAttribute('aria-label', `${ward.name} Monitoring Station (AQI ${ward.aqi})`);
      el.setAttribute('title', `${ward.name} Monitoring Station`);
    }
  });
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
 * A city is a place to navigate to, not a measurement — no AQI value is
 * stored or shown for it. The label is always visible so the map reads
 * as a map of India at a glance; clicking flies in to the city.
 */
function createCityMarker(city, onFlyTo) {
  const customIcon = L.divIcon({
    className: 'aura-city-marker',
    html: `
      <span class="city-dot"></span>
      <span class="city-label">${city.name}</span>
    `,
    iconSize: [120, 20],
    iconAnchor: [6, 10]
  });

  const marker = L.marker([city.lat, city.lng], {
    icon: customIcon,
    title: `${city.name}, ${city.state}`,
    alt: `${city.name}, ${city.state}`
  });
  marker.on('add', () => {
    const el = marker.getElement();
    if (el) {
      el.setAttribute('aria-label', `${city.name}, ${city.state}`);
      el.setAttribute('title', `${city.name}, ${city.state}`);
    }
  });
  marker.bindPopup(`
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
      <div style="font-weight: bold; color: #22d3ee; margin-bottom: 4px;">${city.name}, ${city.state}</div>
      <div style="color: #94a3b8;">Live air quality for this city is on the Command Center — search the city name there.</div>
    </div>
  `);
  marker.on('click', onFlyTo);
  return marker;
}

/**
 * Manages Leaflet map initialization, tactical overlays, and sensor markers.
 * The map opens on the whole of India with named city markers; the Delhi
 * ward sensors are the detailed layer underneath.
 * @returns {{ resetIndiaView: () => void }} - Zooms back out to the India view.
 */
export function useThreatMapLeaflet(
  mapContainerRef,
  selectedWard,
  setSelectedWardId,
  addToast,
  layers
) {
  /** @type {React.MutableRefObject<ReturnType<typeof L.map> | null>} */
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: INDIA_VIEW.center,
      zoom: INDIA_VIEW.zoom,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer(TILE_URL, {
      maxZoom: 19,
      attribution: TILE_ATTRIBUTION
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

    INDIA_CITIES.forEach((city) => {
      const marker = createCityMarker(city, () => {
        map.flyTo([city.lat, city.lng], INDIA_VIEW.cityZoom);
      });
      marker.addTo(map);
      markersRef.current[`city_${city.id}`] = marker;
    });

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

  const resetIndiaView = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) map.setView(INDIA_VIEW.center, INDIA_VIEW.zoom);
  }, []);

  return { resetIndiaView };
}

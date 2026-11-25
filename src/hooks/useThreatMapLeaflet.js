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
 * Free basemap with no API key. The map has now lost two tile providers:
 * CARTO's dark tiles started returning "API KEY REQUIRED" watermark tiles,
 * and OpenStreetMap's volunteer-run servers return 403 "Access blocked"
 * tiles for some networks (their tile usage policy blocks whole IP ranges
 * when abuse is detected, so it works from one network and not another).
 * Esri's World Street Map is served from their commercial CDN for exactly
 * this embedding use, needs no key, and does not block per IP. Note the
 * URL order is {z}/{y}/{x}, unlike OSM's {z}/{x}/{y}. Attribution is
 * required and Leaflet shows it because attributionControl is on. The
 * existing `.aura-map` CSS darkens the light tiles to match the app's
 * dark theme.
 */
const TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
const TILE_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Source: Esri, TomTom, Garmin, FAO, NOAA, USGS, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, and the GIS User Community';

/**
 * State boundaries overlay. The GeoJSON is a simplified copy of the
 * BharatMaps state dataset (36 states/UTs, NAME_1 property), shipped as a
 * static file so it costs nothing in the JS bundle and is cached by the
 * browser. If it fails to load, the map still works — only the state
 * outlines are missing.
 */
const STATES_GEOJSON_URL = '/data/india-states.geojson';
const STATE_STYLE = { color: '#22d3ee', weight: 1, opacity: 0.5, fillOpacity: 0 };
/** States smaller than this (bounds span product, sq. degrees) only get a
 * name label once the user zooms in (zoom >= 6); big states are labelled
 * at the India-wide view too. Keeps tiny neighbours (Goa, Delhi,
 * Chandigarh) from overlapping at zoom 5. */
const SMALL_STATE_AREA = 2;
const SMALL_STATE_MIN_ZOOM = 6;

/** A state name shown on the map. Non-interactive so it never blocks clicks. */
function createStateLabel(name, center) {
  const labelIcon = L.divIcon({
    className: 'aura-state-label',
    html: `<span>${name}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
  return L.marker(center, { icon: labelIcon, interactive: false, keyboard: false });
}

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
 * ward sensors are the detailed layer underneath. State boundaries and
 * state names come from a static GeoJSON overlay, and locateMe drops a
 * marker on the user's current position (browser geolocation).
 * @returns {{ resetIndiaView: () => void, locateMe: () => void }} - Zooms back out to the India view, and centres on the user's location.
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
  /** @type {React.MutableRefObject<{ boundaries: { remove: () => void } | null, labels: Array<{ marker: { addTo: (map: unknown) => unknown, remove: () => void }, area: number, shown: boolean }> }>} */
  const stateLayerRef = useRef({ boundaries: null, labels: [] });
  /** @type {React.MutableRefObject<{ remove: () => void } | null>} */
  const locationMarkerRef = useRef(null);

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

  const locateMe = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) map.locate({ setView: true, maxZoom: 12 });
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const updateStateLabels = () => {
      const state = stateLayerRef.current;
      if (!state) return;
      const zoom = map.getZoom();
      state.labels.forEach((entry) => {
        const shouldShow = zoom >= SMALL_STATE_MIN_ZOOM || entry.area > SMALL_STATE_AREA;
        if (shouldShow && !entry.shown) {
          entry.marker.addTo(map);
          entry.shown = true;
        } else if (!shouldShow && entry.shown) {
          entry.marker.remove();
          entry.shown = false;
        }
      });
    };

    const onLocationFound = (event) => {
      if (locationMarkerRef.current) locationMarkerRef.current.remove();
      const marker = L.circleMarker(event.latlng, {
        color: '#ffffff',
        weight: 2,
        fillColor: '#22d3ee',
        fillOpacity: 0.7,
        radius: 8
      });
      marker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <div style="font-weight: bold; color: #22d3ee; margin-bottom: 4px;">You are here</div>
          <div style="color: #94a3b8;">Your current position, from your browser location.</div>
        </div>
      `);
      marker.addTo(map);
      locationMarkerRef.current = marker;
      addToast('Location Found', 'Showing your current position on the map', 'cyan');
    };
    const onLocationError = () => {
      addToast(
        'Location Unavailable',
        'Allow location access in your browser to show your position',
        'red'
      );
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.on('zoomend', updateStateLabels);

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(STATES_GEOJSON_URL);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !mapInstanceRef.current) return;
        const boundaries = L.geoJSON(data, {
          style: STATE_STYLE,
          onEachFeature: (feature, layer) => {
            const name = feature && feature.properties ? feature.properties.NAME_1 : null;
            if (!name || typeof layer.getBounds !== 'function') return;
            const bounds = layer.getBounds();
            const area =
              Math.abs(bounds.getEast() - bounds.getWest()) *
              Math.abs(bounds.getNorth() - bounds.getSouth());
            stateLayerRef.current.labels.push({
              marker: createStateLabel(name, bounds.getCenter()),
              area,
              shown: false
            });
          }
        });
        boundaries.addTo(map);
        stateLayerRef.current.boundaries = boundaries;
        updateStateLabels();
      } catch {
        // State outlines are an optional layer; the map works without them.
      }
    })();

    return () => {
      cancelled = true;
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
      map.off('zoomend', updateStateLabels);
      const state = stateLayerRef.current;
      if (state) {
        state.labels.forEach((entry) => entry.marker.remove());
        if (state.boundaries) state.boundaries.remove();
        stateLayerRef.current = { boundaries: null, labels: [] };
      }
      if (locationMarkerRef.current) {
        locationMarkerRef.current.remove();
        locationMarkerRef.current = null;
      }
    };
  }, [addToast]);

  return { resetIndiaView, locateMe };
}

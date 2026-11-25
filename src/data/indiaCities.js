/**
 * @file indiaCities.js
 * Major Indian cities shown on the Threat Map so the map reads as a map
 * of India, not only Delhi. Coordinates are the well-known city centres
 * (public geographic facts). No air-quality values are stored here:
 * a city marker is a place to navigate to, not a measurement. Live air
 * quality for any city comes from the free Open-Meteo / CAMS APIs on
 * the Command Center — the marker popup says exactly that.
 */

/** Default view: the whole of India, with every city marker visible. */
export const INDIA_VIEW = Object.freeze({
  center: [22.97, 78.65],
  zoom: 5,
  /** Zoom used when flying to a single city. */
  cityZoom: 9
});

export const INDIA_CITIES = Object.freeze([
  { id: 'delhi', name: 'Delhi', state: 'Delhi', lat: 28.61, lng: 77.21 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.08, lng: 72.88 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', lat: 12.97, lng: 77.59 },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.08, lng: 80.27 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.57, lng: 88.36 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.39, lng: 78.49 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', lat: 18.52, lng: 73.86 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', lat: 23.02, lng: 72.57 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.91, lng: 75.79 },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.85, lng: 80.95 }
]);

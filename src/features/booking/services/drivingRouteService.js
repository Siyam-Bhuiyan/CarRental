import { bearing, haversineKm } from '@/components/map/mapMath';

const OSRM = 'https://router.project-osrm.org/route/v1/driving';
const TIMEOUT_MS = 8000;

// Straight-line fallback so the flow still works offline / if the routing server is down.
function straightLine(from, to) {
  const steps = 24;
  const coordinates = Array.from({ length: steps + 1 }, (_, i) => ({
    latitude: from.latitude + ((to.latitude - from.latitude) * i) / steps,
    longitude: from.longitude + ((to.longitude - from.longitude) * i) / steps,
  }));
  const distanceKm = haversineKm(from, to) * 1.3;
  return {
    coordinates,
    distanceKm,
    durationMin: (distanceKm / 35) * 60,
    estimated: true,
  };
}

// Driving route between two coordinates using the free OSRM demo server (no API key).
export async function getDrivingRoute(from, to) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = `${OSRM}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: controller.signal });
    const json = await res.json();
    const route = json.routes?.[0];
    if (!route) throw new Error('No route');
    return {
      coordinates: route.geometry.coordinates.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      })),
      distanceKm: route.distance / 1000,
      durationMin: route.duration / 60,
      estimated: false,
    };
  } catch {
    return straightLine(from, to);
  } finally {
    clearTimeout(timer);
  }
}

export { bearing };

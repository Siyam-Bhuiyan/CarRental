import routeMock from '@/mocks/route.json';

// Returns the polyline for a journey. Hardcoded for the assessment; a production version
// would call a routing API (e.g. OSRM `/route/v1/driving/{lng,lat;lng,lat}`) and decode
// the returned geometry into [{ latitude, longitude }] here, leaving callers untouched.
export async function getRoute() {
  return routeMock.coordinates;
}

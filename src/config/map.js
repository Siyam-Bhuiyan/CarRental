// Map tiles: Esri "World Dark Gray Canvas" base layer. Dark grey, label-free raster tiles
// that match the design, served without an API key.
// (CARTO Dark Matter now answers with an "API key required" placeholder tile.)
// Attribution is required. For production use a hosted provider (e.g. MapLibre +
// MapTiler/Stadia with a key) - see README.
export const DARK_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
export const TILE_MAX_ZOOM = 16;

export const MAP_ATTRIBUTION =
  'Tiles © Esri — HERE, Garmin, © OpenStreetMap contributors';

// Padding (design pts) kept around the route when fitting it into the header.
export const ROUTE_EDGE_PADDING = { top: 90, right: 56, bottom: 56, left: 56 };

export const ROUTE_STYLE = {
  color: '#FFFFFF',
  width: 4,
  glowColor: 'rgba(255,255,255,0.24)',
  glowWidth: 12,
};

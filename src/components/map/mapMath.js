import { DARK_TILE_URL, TILE_MAX_ZOOM } from '@/config/map';

// Web Mercator helpers shared by the map components. A "unit" point is a position on the
// whole world mapped to a 0..1 square, which keeps zoom arithmetic trivial.
export const TILE = 256;
export const MIN_ZOOM = 3;
export const MAX_ZOOM = 18;

export const toUnit = ({ latitude, longitude }) => {
  const sin = Math.sin((latitude * Math.PI) / 180);
  return {
    x: (longitude + 180) / 360,
    y: 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI),
  };
};

export const fromUnit = ({ x, y }) => ({
  longitude: x * 360 - 180,
  latitude: (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI,
});

export const worldSize = (zoom) => TILE * 2 ** zoom;

export const clampZoom = (zoom) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

// Zoom + centre that fit `coordinates` inside the padded viewport.
export function fitView(coordinates, size, padding = {}) {
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
  const pts = coordinates.map(toUnit);
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const availW = Math.max(size.width - left - right, 1);
  const availH = Math.max(size.height - top - bottom, 1);
  const spanX = Math.max(maxX - minX, 1e-9);
  const spanY = Math.max(maxY - minY, 1e-9);
  const zoom = clampZoom(
    Math.min(Math.log2(availW / (spanX * TILE)), Math.log2(availH / (spanY * TILE)), 16),
  );

  // centre the bounding box inside the padded area (not the whole viewport)
  const world = worldSize(zoom);
  const boxCx = (minX + maxX) / 2;
  const boxCy = (minY + maxY) / 2;
  const padShiftX = (left - right) / 2;
  const padShiftY = (top - bottom) / 2;
  return {
    zoom,
    cx: boxCx - padShiftX / world,
    cy: boxCy - padShiftY / world,
  };
}

export const tileUrl = (z, x, y) =>
  DARK_TILE_URL.replace('{z}', z).replace('{x}', x).replace('{y}', y);

// Tiles that cover the viewport (plus `buffer` px on every side so panning has no blank edge).
export function visibleTiles(view, size, offset, buffer = TILE) {
  const world = worldSize(view.zoom);
  const z = Math.max(0, Math.min(Math.floor(view.zoom), TILE_MAX_ZOOM));
  const n = 2 ** z;
  const tileSize = world / n;
  const ox = size.width / 2 + offset.x;
  const oy = size.height / 2 + offset.y;

  const minI = Math.floor((view.cx - (ox + buffer) / world) * n);
  const maxI = Math.floor((view.cx + (size.width - ox + buffer) / world) * n);
  const minJ = Math.floor((view.cy - (oy + buffer) / world) * n);
  const maxJ = Math.floor((view.cy + (size.height - oy + buffer) / world) * n);

  const tiles = [];
  for (let i = minI; i <= maxI; i++) {
    for (let j = minJ; j <= maxJ; j++) {
      if (i < 0 || j < 0 || i >= n || j >= n) continue;
      tiles.push({
        key: `${z}/${i}/${j}`,
        uri: tileUrl(z, i, j),
        left: (i / n - view.cx) * world + ox,
        top: (j / n - view.cy) * world + oy,
      });
    }
  }
  return { tiles, tileSize };
}

export function haversineKm(a, b) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Compass bearing (0 = north, clockwise) from a to b, in degrees.
export function bearing(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const y = Math.sin(rad(b.longitude - a.longitude)) * Math.cos(rad(b.latitude));
  const x =
    Math.cos(rad(a.latitude)) * Math.sin(rad(b.latitude)) -
    Math.sin(rad(a.latitude)) *
      Math.cos(rad(b.latitude)) *
      Math.cos(rad(b.longitude - a.longitude));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

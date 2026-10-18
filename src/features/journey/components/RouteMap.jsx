import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import {
  DARK_TILE_URL,
  ROUTE_EDGE_PADDING,
  ROUTE_STYLE,
  TILE_MAX_ZOOM,
} from '@/config/map';

// Non-interactive dark map that frames the journey route, used on iOS, Android and web.
// It is a small slippy-map renderer: Web Mercator maths picks the zoom that fits the route,
// raster tiles (no API key, see config/map.js) are laid out with <Image>, and the route is
// drawn with react-native-svg. Because it only uses core RN + SVG it behaves identically in
// Expo Go and in builds, with no Google/Apple map SDK involved.
const TILE = 256;
const tileUrl = (z, x, y) =>
  DARK_TILE_URL.replace('{z}', z).replace('{x}', x).replace('{y}', y);

// lat/lng -> unit square (0..1) in Web Mercator
const toUnit = ({ latitude, longitude }) => {
  const sin = Math.sin((latitude * Math.PI) / 180);
  return {
    x: (longitude + 180) / 360,
    y: 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI),
  };
};

function buildView(route, width, height) {
  const pts = route.map(toUnit);
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const { top, right, bottom, left } = ROUTE_EDGE_PADDING;
  const availW = Math.max(width - left - right, 1);
  const availH = Math.max(height - top - bottom, 1);
  const spanX = Math.max(maxX - minX, 1e-9);
  const spanY = Math.max(maxY - minY, 1e-9);

  // fractional zoom that makes the route fill the padded area
  const zoom = Math.min(
    Math.log2(availW / (spanX * TILE)),
    Math.log2(availH / (spanY * TILE)),
    TILE_MAX_ZOOM,
  );
  const world = TILE * 2 ** zoom; // px size of the whole world at this zoom
  const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  const originX = left + availW / 2;
  const originY = top + availH / 2;

  const toScreen = (u) => ({
    x: (u.x - center.x) * world + originX,
    y: (u.y - center.y) * world + originY,
  });

  // tiles are fetched at an integer zoom and scaled to the fractional one
  const z = Math.max(0, Math.floor(zoom));
  const n = 2 ** z;
  const tileSize = world / n;
  const first = (axis, size, origin) => Math.floor((center[axis] - origin / world) * n);
  const last = (axis, size, origin) =>
    Math.floor((center[axis] + (size - origin) / world) * n);

  const tiles = [];
  for (let tx = first('x', width, originX); tx <= last('x', width, originX); tx++) {
    for (let ty = first('y', height, originY); ty <= last('y', height, originY); ty++) {
      if (tx < 0 || ty < 0 || tx >= n || ty >= n) continue;
      const s = toScreen({ x: tx / n, y: ty / n });
      tiles.push({ key: `${tx}/${ty}`, uri: tileUrl(z, tx, ty), left: s.x, top: s.y });
    }
  }

  return { tiles, tileSize, toScreen, pts: pts.map(toScreen) };
}

export default function RouteMap({ route, style }) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const view = useMemo(() => {
    if (!size.width || !route?.length) return null;
    return buildView(route, size.width, size.height);
  }, [route, size]);

  const points = view?.pts.map((p) => `${p.x},${p.y}`).join(' ');
  const start = view?.pts[0];
  const end = view?.pts[view.pts.length - 1];

  return (
    <View
      style={[styles.container, style]}
      pointerEvents="none"
      onLayout={(e) => setSize(e.nativeEvent.layout)}
    >
      {view?.tiles.map((tile) => (
        <Image
          key={tile.key}
          source={{ uri: tile.uri }}
          style={{
            position: 'absolute',
            left: tile.left,
            top: tile.top,
            width: view.tileSize + 0.5,
            height: view.tileSize + 0.5,
          }}
        />
      ))}
      {view && (
        <>
          <Svg width={size.width} height={size.height} style={StyleSheet.absoluteFill}>
            <Polyline
              points={points}
              fill="none"
              stroke={ROUTE_STYLE.glowColor}
              strokeWidth={ROUTE_STYLE.glowWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points={points}
              fill="none"
              stroke={ROUTE_STYLE.color}
              strokeWidth={ROUTE_STYLE.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <View style={[styles.originDot, { left: start.x - 4, top: start.y - 4 }]} />
          <Icon
            name="destinationPin"
            style={{ position: 'absolute', left: end.x - 10, top: end.y - 18 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#111111', overflow: 'hidden' },
  originDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
});

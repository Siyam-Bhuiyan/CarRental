import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useMap } from './MapContext';

// Route line with an optional soft glow underlay.
export default function MapPolyline({
  coordinates,
  color = '#FFFFFF',
  width = 4,
  glowColor,
  glowWidth = 12,
}) {
  const { project, size } = useMap();
  if (!coordinates?.length) return null;
  const points = coordinates
    .map((c) => {
      const p = project(c);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const common = {
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    points,
  };
  return (
    <Svg
      width={size.width}
      height={size.height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {glowColor && <Polyline {...common} stroke={glowColor} strokeWidth={glowWidth} />}
      <Polyline {...common} stroke={color} strokeWidth={width} />
    </Svg>
  );
}

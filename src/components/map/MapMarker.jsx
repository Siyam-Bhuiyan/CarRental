import React from 'react';
import { View } from 'react-native';
import { useMap } from './MapContext';

// Places `children` at a coordinate. `anchor` is the point of the child (0..1) that sits on
// the coordinate: the centre for dots / cars, bottom-centre for pins.
export default function MapMarker({
  coordinate,
  width,
  height,
  anchor = { x: 0.5, y: 0.5 },
  rotation = 0,
  children,
  zIndex = 1,
}) {
  const { project } = useMap();
  const { x, y } = project(coordinate);
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width,
        height,
        left: x - width * anchor.x,
        top: y - height * anchor.y,
        zIndex,
        transform: rotation ? [{ rotate: `${rotation}deg` }] : undefined,
      }}
    >
      {children}
    </View>
  );
}

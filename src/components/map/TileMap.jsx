import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { BASE_DETAIL_BOOST } from '@/config/map';
import { MapContext } from './MapContext';
import {
  TILE,
  clampZoom,
  fitView,
  fromUnit,
  labelUrl,
  toUnit,
  visibleTiles,
  worldSize,
} from './mapMath';

const NO_OFFSET = { x: 0, y: 0 };

// Slippy map built from core RN pieces: raster tiles laid out with <Image>, overlays as
// children. Pan and pinch are applied as a transform while the gesture runs and committed
// to the view (re-laying out the tiles) when it ends.
//
// Props
//   initialCenter / initialZoom   starting camera ({ latitude, longitude }, zoom level)
//   fitCoordinates / fitPadding   alternative to the above: frame these coordinates
//   focusOffset                   shifts the camera focus point (e.g. above a bottom sheet)
//   interactive                   enable pan + pinch (default true)
//   onViewChange                  called after each gesture with { center, zoom }
// Ref: recenter(coordinate, zoom?)
const TileMap = forwardRef(function TileMap(
  {
    initialCenter,
    initialZoom = 14,
    fitCoordinates,
    fitPadding,
    focusOffset = NO_OFFSET,
    interactive = true,
    showLabels = true,
    onViewChange,
    style,
    children,
  },
  ref,
) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState(() => {
    const u = toUnit(initialCenter ?? { latitude: 0, longitude: 0 });
    return { cx: u.x, cy: u.y, zoom: initialZoom };
  });

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const sc = useSharedValue(1);
  const startTx = useSharedValue(0);
  const startTy = useSharedValue(0);
  const startSc = useSharedValue(1);

  // Frame the given coordinates once the size is known (and whenever they change).
  const fitKey = fitCoordinates
    ? fitCoordinates.map((c) => `${c.latitude},${c.longitude}`).join('|')
    : '';
  useEffect(() => {
    if (!fitCoordinates?.length || !size.width) return;
    setView(fitView(fitCoordinates, size, fitPadding));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, size.width, size.height]);

  useImperativeHandle(
    ref,
    () => ({
      recenter(coordinate, zoom) {
        const u = toUnit(coordinate);
        setView((v) => ({ cx: u.x, cy: u.y, zoom: zoom ?? v.zoom }));
      },
    }),
    [],
  );

  // After a new view is committed, clear the temporary gesture transform.
  useEffect(() => {
    tx.value = 0;
    ty.value = 0;
    sc.value = 1;
  }, [view, tx, ty, sc]);

  const viewRef = useRef(view);
  viewRef.current = view;

  const commit = useCallback(
    (dx, dy, scale) => {
      const v = viewRef.current;
      const world = worldSize(v.zoom);
      const next = {
        cx: v.cx - dx / (scale * world),
        cy: v.cy - dy / (scale * world),
        zoom: clampZoom(v.zoom + Math.log2(scale)),
      };
      setView(next);
      onViewChange?.({ center: fromUnit({ x: next.cx, y: next.cy }), zoom: next.zoom });
    },
    [onViewChange],
  );

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .onStart(() => {
        startTx.value = tx.value;
        startTy.value = ty.value;
      })
      .onUpdate((e) => {
        tx.value = startTx.value + e.translationX;
        ty.value = startTy.value + e.translationY;
      })
      .onEnd(() => {
        scheduleOnRN(commit, tx.value, ty.value, sc.value);
      });
    const pinch = Gesture.Pinch()
      .onStart(() => {
        startSc.value = sc.value;
      })
      .onUpdate((e) => {
        sc.value = Math.min(Math.max(startSc.value * e.scale, 0.4), 4);
      })
      .onEnd(() => {
        scheduleOnRN(commit, tx.value, ty.value, sc.value);
      });
    return Gesture.Simultaneous(pan, pinch);
  }, [commit, tx, ty, sc, startTx, startTy, startSc]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: sc.value }],
  }));

  const ox = size.width / 2 + focusOffset.x;
  const oy = size.height / 2 + focusOffset.y;
  const world = worldSize(view.zoom);

  const project = useCallback(
    (coordinate) => {
      const u = toUnit(coordinate);
      return { x: (u.x - view.cx) * world + ox, y: (u.y - view.cy) * world + oy };
    },
    [view.cx, view.cy, world, ox, oy],
  );

  const ctx = useMemo(
    () => ({ project, zoom: view.zoom, size }),
    [project, view.zoom, size],
  );

  const layout = useMemo(() => {
    if (!size.width)
      return {
        base: { tiles: [], tileSize: TILE },
        labels: { tiles: [], tileSize: TILE },
      };
    const buffer = interactive ? TILE / 2 : 0;
    return {
      base: visibleTiles(view, size, focusOffset, { buffer, boost: BASE_DETAIL_BOOST }),
      labels: showLabels
        ? visibleTiles(view, size, focusOffset, { buffer, url: labelUrl })
        : { tiles: [], tileSize: TILE },
    };
  }, [view, size, focusOffset, interactive, showLabels]);

  const content = (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      {[layout.base, layout.labels].map((layer, layerIndex) =>
        layer.tiles.map((tile) => (
          <Image
            key={`${layerIndex}-${tile.key}`}
            source={{ uri: tile.uri }}
            fadeDuration={0}
            style={{
              position: 'absolute',
              left: tile.left,
              top: tile.top,
              width: layer.tileSize + 0.5,
              height: layer.tileSize + 0.5,
            }}
          />
        )),
      )}
      <MapContext.Provider value={ctx}>
        {size.width ? children : null}
      </MapContext.Provider>
    </Animated.View>
  );

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => setSize(e.nativeEvent.layout)}
    >
      {interactive ? (
        <GestureDetector gesture={gesture}>{content}</GestureDetector>
      ) : (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {content}
        </View>
      )}
    </View>
  );
});

export default TileMap;

const styles = StyleSheet.create({
  container: { backgroundColor: '#1d1d21', overflow: 'hidden' },
});

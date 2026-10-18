import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { MapMarker, MapPolyline, TileMap } from '@/components/map';
import { ROUTE_EDGE_PADDING, ROUTE_STYLE } from '@/config/map';

// Non-interactive dark map that frames a route (origin dot, white route line, destination
// pin). Used on the journey header and on the booking screens. It sits on the shared
// TileMap, so it behaves identically on iOS, Android (Expo Go) and web.
export default function RouteMap({
  route,
  origin,
  destination,
  padding = ROUTE_EDGE_PADDING,
  style,
}) {
  return (
    <TileMap
      style={style}
      interactive={false}
      fitCoordinates={route}
      fitPadding={padding}
    >
      <MapPolyline
        coordinates={route}
        color={ROUTE_STYLE.color}
        width={ROUTE_STYLE.width}
        glowColor={ROUTE_STYLE.glowColor}
        glowWidth={ROUTE_STYLE.glowWidth}
      />
      <MapMarker coordinate={origin} width={8} height={8} zIndex={3}>
        <View style={styles.originDot} />
      </MapMarker>
      <MapMarker
        coordinate={destination}
        width={20}
        height={20}
        anchor={{ x: 0.5, y: 0.9 }}
        zIndex={4}
      >
        <Icon name="destinationPin" />
      </MapMarker>
    </TileMap>
  );
}

const styles = StyleSheet.create({
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
});

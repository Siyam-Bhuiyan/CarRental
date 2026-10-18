import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, screenPadding } from '@/theme';
import { AppText, Badge } from '@/components/ui';
import { MAP_ATTRIBUTION } from '@/config/map';
import RouteMap from './RouteMap';

export const MAP_HEIGHT = 222;

// Map banner at the top of the journey screen with the BOOKED status chip over it.
export default function JourneyMapHeader({ route, origin, destination, status }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <RouteMap
        route={route}
        origin={origin}
        destination={destination}
        style={StyleSheet.absoluteFill}
      />
      {/* darkens the status-bar area like the design's 20% black strip */}
      <View pointerEvents="none" style={[styles.statusShade, { height: insets.top }]} />
      <AppText
        variant="caption"
        color="rgba(255,255,255,0.35)"
        style={styles.attribution}
      >
        {MAP_ATTRIBUTION}
      </AppText>
      <Badge
        label={status}
        textColor={colors.warning}
        backgroundColor={colors.warningAlpha20}
        radius={6}
        textVariant="chip"
        style={styles.status}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: MAP_HEIGHT, backgroundColor: '#111111' },
  statusShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3,3,3,0.2)',
  },
  attribution: { position: 'absolute', left: 8, bottom: 4, fontSize: 8, lineHeight: 10 },
  status: {
    position: 'absolute',
    right: screenPadding,
    bottom: 12,
    height: 26,
    paddingHorizontal: 13,
  },
});

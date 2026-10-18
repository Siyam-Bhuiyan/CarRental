import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme';
import { MapMarker } from '@/components/map';

const SIZE = 56;

// "You are here": gold dot with a soft pulsing halo.
export default function UserLocationMarker({ coordinate }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }),
      -1,
    );
  }, [pulse]);

  const halo = useAnimatedStyle(() => ({
    opacity: 0.45 * (1 - pulse.value),
    transform: [{ scale: 0.3 + pulse.value * 0.7 }],
  }));

  return (
    <MapMarker coordinate={coordinate} width={SIZE} height={SIZE} zIndex={5}>
      <View style={styles.wrap}>
        <Animated.View style={[styles.halo, halo]} />
        <View style={styles.dot} />
      </View>
    </MapMarker>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.accent,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.white,
  },
});

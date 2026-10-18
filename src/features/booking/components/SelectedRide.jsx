import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { CAR_ASPECT, getCarImage } from '@/assets/images/cars';
import { AppText, PressableScale } from '@/components/ui';

// The chosen ride category on the checkout screen, with a shortcut to change it.
export default function SelectedRide({ vehicle, etaMin, onChange }) {
  return (
    <View style={styles.card}>
      <Image
        source={getCarImage(vehicle.image)}
        style={{ width: 88, height: 88 / CAR_ASPECT }}
        resizeMode="contain"
      />
      <View style={styles.text}>
        <AppText variant="title">{vehicle.name}</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {vehicle.seats} seats · {etaMin} min away
        </AppText>
      </View>
      <PressableScale
        onPress={onChange}
        accessibilityRole="button"
        accessibilityLabel="Change ride"
        style={styles.change}
      >
        <AppText variant="chip" color={colors.textSecondary}>
          Change
        </AppText>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 72,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
  },
  text: { flex: 1, gap: 2 },
  change: {
    height: 22,
    paddingHorizontal: 9,
    borderRadius: 4,
    justifyContent: 'center',
    backgroundColor: colors.whiteAlpha10,
  },
});

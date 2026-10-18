import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { CAR_ASPECT, getCarImage } from '@/assets/images/cars';
import Icon from '@/components/icons/Icon';
import { AppText, PressableScale } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';

const IMAGE_WIDTH = 88;

// One bookable ride category. The selected card gets a gold outline and tint.
export default function VehicleCard({ vehicle, price, selected, onPress }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${vehicle.name}, ${formatCurrency(price)}, ${vehicle.etaMin} minutes away`}
      style={[styles.card, selected && styles.selected]}
    >
      <Image
        source={getCarImage(vehicle.image)}
        style={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH / CAR_ASPECT }}
        resizeMode="contain"
      />
      <View style={styles.text}>
        <AppText variant="title">{vehicle.name}</AppText>
        <View style={styles.meta}>
          <Icon name="users" size={14} color={colors.textMuted} />
          <AppText variant="caption" color={colors.textMuted}>
            {vehicle.seats}
          </AppText>
          <Icon name="bag" size={14} color={colors.textMuted} />
          <AppText variant="caption" color={colors.textMuted}>
            {vehicle.bags}
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            · {vehicle.etaMin} min away
          </AppText>
        </View>
        <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
          {vehicle.tagline}
        </AppText>
      </View>
      <AppText variant="title" color={selected ? colors.accent : colors.white}>
        {formatCurrency(price)}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 84,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selected: { borderColor: colors.accent, backgroundColor: colors.accentAlpha10 },
  text: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});

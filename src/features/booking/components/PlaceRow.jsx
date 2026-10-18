import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, PressableScale } from '@/components/ui';

// One suggested place: icon bubble, name and address, with a bottom hairline.
export default function PlaceRow({ place, onPress }) {
  const airport = place.kind === 'airport';
  return (
    <PressableScale
      onPress={() => onPress(place)}
      scaleTo={0.99}
      accessibilityRole="button"
      accessibilityLabel={`${place.title}, ${place.address}`}
      style={styles.row}
    >
      <View style={styles.bubble}>
        <Icon name={airport ? 'navigation' : 'mapPin'} color={colors.textSecondary} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyMedium" numberOfLines={1}>
          {place.title}
        </AppText>
        <AppText variant="bodySm" color={colors.textMuted} numberOfLines={1}>
          {place.address}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteAlpha8,
  },
  text: { flex: 1, gap: 1 },
});

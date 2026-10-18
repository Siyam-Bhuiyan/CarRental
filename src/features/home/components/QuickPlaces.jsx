import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { colors, screenPadding } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, PressableScale } from '@/components/ui';

// Horizontal shortcuts to popular destinations.
export default function QuickPlaces({ places, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {places.map((place) => (
        <PressableScale
          key={place.id}
          onPress={() => onSelect(place)}
          accessibilityRole="button"
          accessibilityLabel={`Go to ${place.title}`}
          style={styles.chip}
        >
          <Icon name="mapPin" color={colors.accent} size={16} />
          <AppText variant="bodySmMedium" color={colors.textSecondary} numberOfLines={1}>
            {place.short ?? place.title}
          </AppText>
        </PressableScale>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -screenPadding },
  row: { paddingHorizontal: screenPadding, gap: 8 },
  chip: {
    height: 36,
    paddingLeft: 8,
    paddingRight: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.whiteAlpha8,
  },
});

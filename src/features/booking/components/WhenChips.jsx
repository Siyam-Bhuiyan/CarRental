import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { colors, screenPadding } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, PressableScale } from '@/components/ui';

// Pick-up time presets. The selected chip is the white pill used by the segmented control.
export default function WhenChips({ options, value, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {options.map((option) => {
        const selected = option.id === value?.id;
        return (
          <PressableScale
            key={option.id}
            onPress={() => onChange(option)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.chip, selected && styles.selected]}
          >
            <Icon
              name="clock"
              size={16}
              color={selected ? colors.textOnLight : colors.textSecondary}
            />
            <AppText
              variant="bodySmMedium"
              color={selected ? colors.textOnLight : colors.textSecondary}
            >
              {option.label}
            </AppText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -screenPadding },
  row: { paddingHorizontal: screenPadding, gap: 8 },
  chip: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.whiteAlpha8,
  },
  selected: { backgroundColor: colors.white },
});

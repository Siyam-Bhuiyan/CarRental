import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, PressableScale } from '@/components/ui';

// The big "Where to?" entry field that starts a booking.
export default function WhereToBar({ onPress }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="button"
      accessibilityLabel="Where to?"
      style={styles.bar}
    >
      <Icon name="search" color={colors.textSecondary} />
      <AppText variant="button" style={styles.label}>
        Where to?
      </AppText>
      <View style={styles.chip}>
        <Icon name="clock" color={colors.textSecondary} size={16} />
        <AppText variant="chip" color={colors.textSecondary}>
          Now
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { flex: 1 },
  chip: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.whiteAlpha10,
  },
});

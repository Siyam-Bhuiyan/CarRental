import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii } from '@/theme';
import AppText from './AppText';

// Small rounded status chip (BOOKED, UNPAID, Active, Change ...).
export default function Badge({
  label,
  textColor = colors.textSecondary,
  backgroundColor = colors.whiteAlpha10,
  radius = radii.xs,
  textVariant = 'chip',
  style,
}) {
  return (
    <View style={[styles.base, { backgroundColor, borderRadius: radius }, style]}>
      <AppText variant={textVariant} color={textColor}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 22,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

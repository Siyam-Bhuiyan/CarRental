import React from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import PressableScale from './PressableScale';

// Circular icon button. `variant="light"` is the translucent white 48pt button used in
// headers; `variant="ghost"` is the 40pt faint button used in the passengers toolbar.
const VARIANTS = {
  light: { size: 48, background: colors.whiteAlpha80, iconColor: colors.textOnLight },
  ghost: { size: 40, background: colors.whiteAlpha8, iconColor: colors.white },
};

export default function IconButton({
  icon,
  variant = 'light',
  onPress,
  accessibilityLabel,
  style,
}) {
  const { size, background, iconColor } = VARIANTS[variant];
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={6}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background,
        },
        style,
      ]}
    >
      <Icon name={icon} color={iconColor} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});

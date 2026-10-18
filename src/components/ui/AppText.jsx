import React from 'react';
import { Text } from 'react-native';
import { colors, typography } from '@/theme';

// Single entry point for text so every string uses a typography token.
export default function AppText({
  variant = 'body',
  color = colors.textPrimary,
  style,
  children,
  ...rest
}) {
  return (
    <Text
      allowFontScaling={false}
      style={[typography[variant], { color, includeFontPadding: false }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

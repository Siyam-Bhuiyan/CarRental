import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import AppText from './AppText';
import PressableScale from './PressableScale';

// 48pt call-to-action in the same style as "Manage Journey". `variant="secondary"` is the
// quiet translucent version for secondary actions.
export default function PrimaryButton({
  label,
  onPress,
  icon,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}) {
  const primary = variant === 'primary';
  const textColor = primary ? colors.textOnLight : colors.textSecondary;
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[
        styles.button,
        !primary && styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
    >
      {primary && (
        <LinearGradient
          colors={['#E6E6E6', '#DFDFDD']}
          start={{ x: 0.4, y: 0 }}
          end={{ x: 0.66, y: 0.6 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <>
            {icon && <Icon name={icon} color={textColor} />}
            <AppText variant="button" color={textColor}>
              {label}
            </AppText>
          </>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  secondary: { backgroundColor: colors.whiteAlpha10 },
  disabled: { opacity: 0.4 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});

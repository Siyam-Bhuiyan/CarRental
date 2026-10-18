import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { getAvatar } from '@/assets/images/avatars';
import { AppText, Avatar, IconButton, PressableScale } from '@/components/ui';

// Floating greeting pill (left) and support button (right) over the map.
export default function HomeTopBar({ name, onProfile, onSupport }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.bar, { top: insets.top + 8 }]}>
      <PressableScale
        onPress={onProfile}
        accessibilityRole="button"
        accessibilityLabel="My journeys"
        style={styles.pill}
      >
        <Avatar source={getAvatar('lucas')} size={32} />
        <AppText variant="bodyMedium" color={colors.textOnLight}>
          Hi, {name}
        </AppText>
      </PressableScale>
      <IconButton
        icon="headset"
        accessibilityLabel="Contact support"
        onPress={onSupport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    height: 48,
    paddingLeft: 8,
    paddingRight: 18,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.whiteAlpha80,
  },
});

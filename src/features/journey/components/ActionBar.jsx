import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, screenPadding } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, PressableScale } from '@/components/ui';

export const ACTION_BAR_CONTENT_HEIGHT = 16 + 48 + 16;

// Pinned bottom bar: Cancel (danger tint) + Manage Journey (primary light button).
export default function ActionBar({ onCancel, onManage }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: 16 + insets.bottom }]}>
      <PressableScale
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel="Cancel journey"
        style={[styles.button, styles.cancel]}
      >
        <AppText variant="button" color={colors.danger}>
          Cancel
        </AppText>
      </PressableScale>
      <PressableScale
        onPress={onManage}
        accessibilityRole="button"
        accessibilityLabel="Manage journey"
        style={[styles.button, styles.manage]}
      >
        <LinearGradient
          colors={['#E6E6E6', '#DFDFDD']}
          start={{ x: 0.4, y: 0 }}
          end={{ x: 0.66, y: 0.6 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.manageContent}>
          <Icon name="edit" color="#141B34" />
          <AppText variant="button" color={colors.textOnLight}>
            Manage Journey
          </AppText>
        </View>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    paddingTop: 16,
    paddingHorizontal: screenPadding,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surfaceRaised,
  },
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cancel: { flex: 142, backgroundColor: colors.dangerAlpha10 },
  manage: { flex: 202 },
  manageContent: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});

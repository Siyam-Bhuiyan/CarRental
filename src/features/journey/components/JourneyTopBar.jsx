import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/components/ui';

// Floating back / support buttons; stays put while the page scrolls underneath.
export default function JourneyTopBar({ onBack, onSupport }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.bar, { top: insets.top + 8 }]}>
      <IconButton icon="arrowLeft" accessibilityLabel="Go back" onPress={onBack} />
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
  },
});

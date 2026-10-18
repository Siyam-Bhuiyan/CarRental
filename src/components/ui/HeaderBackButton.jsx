import React from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import PressableScale from './PressableScale';

// Bare arrow (no circle) used in titled headers. 48pt touch target like the design buttons.
export default function HeaderBackButton({ onPress, color = colors.white }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      style={styles.target}
    >
      <Icon name="arrowLeft" color={color} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  target: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme';
import GlowBackground from './GlowBackground';

// Base page shell: near-black background with the faint golden glow.
export default function ScreenContainer({ children, style }) {
  return (
    <View style={[styles.root, style]}>
      <GlowBackground />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});

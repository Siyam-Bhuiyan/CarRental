import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme';

export default function Divider({ style }) {
  return <View style={[styles.line, style]} />;
}

const styles = StyleSheet.create({
  line: { height: 1, backgroundColor: colors.border },
});

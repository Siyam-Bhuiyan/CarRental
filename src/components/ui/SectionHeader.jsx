import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme';
import AppText from './AppText';
import Divider from './Divider';

// Uppercase section label followed by a hairline that fills the remaining width.
// `right` renders an optional trailing element (e.g. the UNPAID badge).
export default function SectionHeader({ title, right, style }) {
  return (
    <View style={[styles.row, style]}>
      <AppText variant="label" color={colors.textSecondary}>
        {title}
      </AppText>
      <Divider style={[styles.line, right ? styles.lineBeforeRight : null]} />
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  line: { flex: 1, marginLeft: 10 },
  lineBeforeRight: { marginRight: 8 },
});

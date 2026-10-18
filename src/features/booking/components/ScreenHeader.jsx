import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, HeaderBackButton } from '@/components/ui';

// Back arrow + title row used by the booking screens (same geometry as the passengers header).
export default function ScreenHeader({ title, onBack, right }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.row, { paddingTop: insets.top + 8 }]}>
      <HeaderBackButton onPress={onBack} />
      <AppText variant="headline" style={styles.title}>
        {title}
      </AppText>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 },
  title: { flex: 1 },
});

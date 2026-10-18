import React from 'react';
import { StyleSheet, View } from 'react-native';
import { screenPadding } from '@/theme';
import { Skeleton } from '@/components/ui';
import { MAP_HEIGHT } from './JourneyMapHeader';

// Loading state that mirrors the journey layout block by block.
export default function JourneySkeleton() {
  return (
    <View>
      <Skeleton width="100%" height={MAP_HEIGHT} radius={0} />
      <View style={styles.body}>
        <View style={styles.between}>
          <Skeleton width={130} height={30} />
          <Skeleton width={120} height={30} />
        </View>
        <View style={[styles.between, styles.section]}>
          <View style={styles.stops}>
            <Skeleton width={150} height={16} />
            <Skeleton width={220} height={11} />
            <Skeleton width={130} height={16} style={styles.gap} />
            <Skeleton width={200} height={11} />
          </View>
          <Skeleton width={74} height={74} radius={8} />
        </View>
        <Skeleton width="100%" height={92} radius={8} style={styles.section} />
        <Skeleton width="100%" height={59} radius={12} style={styles.section} />
        <Skeleton width="100%" height={70} radius={8} style={styles.section} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: screenPadding, paddingTop: 16 },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  section: { marginTop: 24 },
  stops: { gap: 6 },
  gap: { marginTop: 10 },
});

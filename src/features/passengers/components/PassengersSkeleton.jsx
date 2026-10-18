import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, screenPadding } from '@/theme';
import { Skeleton } from '@/components/ui';
import { ROW_HEIGHT } from './PassengerRow';

// Placeholder list shown while passengers load; mirrors PassengerRow geometry.
export default function PassengersSkeleton({ rows = 9 }) {
  return (
    <View>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.row}>
          <Skeleton width={40} height={40} radius={20} />
          <View style={styles.text}>
            <Skeleton width={110 + (i % 3) * 20} height={12} radius={6} />
            <Skeleton width={84} height={10} radius={5} />
          </View>
          <Skeleton width={20} height={20} radius={10} />
          <Skeleton width={20} height={20} radius={10} style={styles.edit} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    marginHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  text: { flex: 1, marginLeft: 13, gap: 8 },
  edit: { marginLeft: 14 },
});

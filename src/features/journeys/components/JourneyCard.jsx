import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, Badge, PressableScale } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatJourneyDate } from '@/utils/formatDate';
import { STATUS_STYLES, journeyTotal } from '@/utils/journey';

// One row of the My Journeys list: status, pickup -> drop-off, date and total.
export default function JourneyCard({ journey, onPress }) {
  const { month, day, time } = formatJourneyDate(journey.scheduledAt);
  const status = STATUS_STYLES[journey.status] ?? STATUS_STYLES.BOOKED;
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="button"
      accessibilityLabel={`Journey to ${journey.destination.title}, ${journey.status}`}
      style={styles.card}
    >
      <View style={styles.top}>
        <View style={styles.type}>
          <Icon name="route" size={20} />
          <AppText variant="subtitle">{journey.type}</AppText>
        </View>
        <Badge label={journey.status} radius={6} {...status} />
      </View>

      <View style={styles.stops}>
        <View style={styles.rail}>
          <View style={styles.dot} />
          <View style={styles.line} />
          <Icon name="mapPin" color={colors.accent} size={16} />
        </View>
        <View style={styles.names}>
          <AppText variant="bodyMedium" numberOfLines={1}>
            {journey.origin.title}
          </AppText>
          <AppText variant="bodyMedium" numberOfLines={1}>
            {journey.destination.title}
          </AppText>
        </View>
      </View>

      <View style={styles.bottom}>
        <AppText variant="bodySm" color={colors.textMuted}>
          {month} {day} · {time}
        </AppText>
        <AppText variant="title" color={colors.textSecondary}>
          {formatCurrency(journeyTotal(journey))}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    gap: 12,
    backgroundColor: colors.surface,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  type: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stops: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rail: { width: 16, alignItems: 'center', gap: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white },
  line: { width: 1, height: 12, backgroundColor: colors.border },
  names: { flex: 1, gap: 6 },
  bottom: {
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

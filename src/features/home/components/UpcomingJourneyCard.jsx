import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, Badge, PressableScale } from '@/components/ui';
import { formatJourneyDate } from '@/utils/formatDate';

// Compact summary of the next booked journey; opens the full journey screen.
export default function UpcomingJourneyCard({ journey, onPress }) {
  const { month, day, time } = formatJourneyDate(journey.scheduledAt);
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="button"
      accessibilityLabel={`Upcoming journey to ${journey.destination.title}`}
      style={styles.card}
    >
      <View style={styles.icon}>
        <Icon name="car" color={colors.accent} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyMedium" numberOfLines={1}>
          {journey.origin.title} → {journey.destination.title}
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {month} {day} · {time}
        </AppText>
      </View>
      <Badge
        label={journey.status}
        textColor={colors.warning}
        backgroundColor={colors.warningAlpha20}
        radius={6}
      />
      <Icon name="chevronRight" color={colors.textMuted} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 64,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentAlpha10,
  },
  text: { flex: 1, gap: 2 },
});

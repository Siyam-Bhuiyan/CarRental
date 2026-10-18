import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText } from '@/components/ui';
import { formatJourneyDate } from '@/utils/formatDate';

function Stop({ title, address }) {
  return (
    <View style={styles.stop}>
      <AppText variant="title" style={styles.stopTitle}>
        {title}
      </AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.address}>
        {address}
      </AppText>
    </View>
  );
}

function DateCard({ iso }) {
  const { month, day, time } = formatJourneyDate(iso);
  return (
    <View style={styles.dateCard}>
      <AppText variant="labelTracked" color={colors.textSecondary}>
        {month}
      </AppText>
      <AppText variant="titleLg" style={styles.day}>
        {day}
      </AppText>
      <AppText variant="bodySm" color={colors.textSecondary} style={styles.time}>
        {time}
      </AppText>
    </View>
  );
}

// Pickup -> drop-off with the connecting rail, plus the date / time card.
export default function RouteSummary({ origin, destination, scheduledAt }) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <Icon name="mapPin" color={colors.white} style={styles.pinStart} />
        <LinearGradient colors={[colors.white, colors.accent]} style={styles.connector} />
        <Icon name="mapPin" color={colors.accent} style={styles.pinEnd} />
      </View>
      <View style={styles.stops}>
        <Stop title={origin.title} address={origin.address} />
        <Stop title={destination.title} address={destination.address} />
      </View>
      <DateCard iso={scheduledAt} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rail: { width: 25 },
  pinStart: { position: 'absolute', left: -2, top: -2 },
  connector: { position: 'absolute', left: 7.5, top: 16, width: 1, height: 32 },
  pinEnd: { position: 'absolute', left: -2, top: 46 },
  stops: { flex: 1 },
  stop: { height: 44 },
  stopTitle: { lineHeight: 18 },
  address: { marginTop: 4.6, marginLeft: -1 },
  dateCard: {
    width: 74,
    height: 74,
    marginTop: 3,
    paddingTop: 9,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  day: { marginTop: -2.6 },
  time: { marginTop: 1.9 },
});

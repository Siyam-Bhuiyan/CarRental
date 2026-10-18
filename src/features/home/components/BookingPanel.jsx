import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, screenPadding } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, PressableScale, SectionHeader } from '@/components/ui';
import QuickPlaces from './QuickPlaces';
import UpcomingJourneyCard from './UpcomingJourneyCard';
import WhereToBar from './WhereToBar';

function ShortcutTile({ icon, label, onPress }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.tile}
    >
      <Icon name={icon} color={colors.textSecondary} />
      <AppText variant="bodySmMedium" color={colors.textSecondary}>
        {label}
      </AppText>
    </PressableScale>
  );
}

// Bottom sheet over the home map: start a booking, jump to a popular place, see the next
// journey, and reach the journeys / passengers lists.
export default function BookingPanel({
  places,
  upcoming,
  onWhereTo,
  onPlace,
  onUpcoming,
  onJourneys,
  onPassengers,
  onLayout,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      onLayout={onLayout}
      style={[styles.panel, { paddingBottom: 16 + insets.bottom }]}
    >
      <View style={styles.handle} />
      <WhereToBar onPress={onWhereTo} />
      <View style={styles.quick}>
        <QuickPlaces places={places} onSelect={onPlace} />
      </View>
      {upcoming && (
        <View style={styles.upcoming}>
          <SectionHeader title="UPCOMING JOURNEY" />
          <View style={styles.card}>
            <UpcomingJourneyCard journey={upcoming} onPress={onUpcoming} />
          </View>
        </View>
      )}
      <View style={styles.tiles}>
        <ShortcutTile icon="receipt" label="My Journeys" onPress={onJourneys} />
        <ShortcutTile icon="user" label="Passengers" onPress={onPassengers} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingHorizontal: screenPadding,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surfaceRaised,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 14,
    backgroundColor: colors.border,
  },
  quick: { marginTop: 12 },
  upcoming: { marginTop: 18 },
  card: { marginTop: 10 },
  tiles: { marginTop: 14, flexDirection: 'row', gap: 10 },
  tile: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.whiteAlpha8,
  },
});

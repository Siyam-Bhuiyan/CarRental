import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { TileMap } from '@/components/map';
import { AppText, PressableScale } from '@/components/ui';
import { DEMO_USER, DEMO_USER_LOCATION, HOME_ZOOM } from '@/config/demo';
import { ROUTES } from '@/constants/routes';
import placesMock from '@/mocks/places.json';
import { useBookingStore } from '@/store/bookingStore';
import { isUpcoming, useJourneysStore } from '@/store/journeysStore';
import { defaultWhen } from '@/features/booking/services/schedule';
import BookingPanel from '../components/BookingPanel';
import HomeTopBar from '../components/HomeTopBar';
import NearbyCars from '../components/NearbyCars';
import UserLocationMarker from '../components/UserLocationMarker';
import { NEARBY_CAR_COUNT } from '../hooks/useNearbyCars';

const QUICK_PLACES = placesMock.slice(0, 5);

export default function HomeScreen() {
  const router = useRouter();
  const mapRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const [focused, setFocused] = useState(true);

  // stop the car simulation while another screen is open on top of Home
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  const journeys = useJourneysStore((s) => s.journeys);
  const upcoming = useMemo(
    () =>
      journeys
        .filter(isUpcoming)
        .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0],
    [journeys],
  );

  // keep the user's position visible above the bottom panel
  const focusOffset = useMemo(() => ({ x: 0, y: -panelHeight / 2 }), [panelHeight]);

  const startBooking = useCallback(() => {
    useBookingStore.getState().reset();
    useBookingStore.getState().setWhen(defaultWhen());
    router.push(ROUTES.search);
  }, [router]);

  const bookPlace = useCallback(
    (place) => {
      const store = useBookingStore.getState();
      store.reset();
      store.setWhen(defaultWhen());
      store.setDropoff(place);
      router.push(ROUTES.vehicles);
    },
    [router],
  );

  return (
    <View style={styles.root}>
      <TileMap
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialCenter={DEMO_USER_LOCATION}
        initialZoom={HOME_ZOOM}
        focusOffset={focusOffset}
      >
        <UserLocationMarker coordinate={DEMO_USER_LOCATION} />
        <NearbyCars center={DEMO_USER_LOCATION} active={focused} />
      </TileMap>

      <HomeTopBar
        name={DEMO_USER.name}
        onProfile={() => router.push(ROUTES.journeys)}
        onSupport={() => Alert.alert('Support', 'Chat support is coming soon.')}
      />

      {panelHeight > 0 && (
        <View
          pointerEvents="box-none"
          style={[styles.floating, { bottom: panelHeight + 12 }]}
        >
          <View style={styles.nearby}>
            <View style={styles.liveDot} />
            <AppText variant="chip" color={colors.textSecondary}>
              {NEARBY_CAR_COUNT} cars nearby
            </AppText>
          </View>
          <PressableScale
            onPress={() => mapRef.current?.recenter(DEMO_USER_LOCATION, HOME_ZOOM)}
            accessibilityRole="button"
            accessibilityLabel="Centre on my location"
            style={styles.locate}
          >
            <Icon name="locate" color={colors.white} />
          </PressableScale>
        </View>
      )}

      <BookingPanel
        places={QUICK_PLACES}
        upcoming={upcoming}
        onLayout={(e) => setPanelHeight(e.nativeEvent.layout.height)}
        onWhereTo={startBooking}
        onPlace={bookPlace}
        onUpcoming={() => router.push(ROUTES.journey(upcoming.id))}
        onJourneys={() => router.push(ROUTES.journeys)}
        onPassengers={() => router.push(ROUTES.passengers)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  floating: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearby: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(11,11,13,0.9)',
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  locate: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,11,13,0.9)',
  },
});

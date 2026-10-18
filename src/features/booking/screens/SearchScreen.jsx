import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { screenPadding } from '@/theme';
import { ScreenContainer } from '@/components/layout';
import { PrimaryButton, SectionHeader } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import placesMock from '@/mocks/places.json';
import { useBookingStore } from '@/store/bookingStore';
import BottomBar, { BOTTOM_BAR_CONTENT } from '../components/BottomBar';
import PlaceRow from '../components/PlaceRow';
import RouteInputs from '../components/RouteInputs';
import ScreenHeader from '../components/ScreenHeader';
import WhenChips from '../components/WhenChips';
import { whenOptions } from '../services/schedule';

export default function SearchScreen() {
  const router = useRouter();
  const { pickup, dropoff, when, setPickup, setDropoff, setWhen, swapStops } =
    useBookingStore();
  const [active, setActive] = useState('dropoff');
  const [query, setQuery] = useState('');
  const options = useMemo(() => whenOptions(), []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const taken = active === 'dropoff' ? pickup?.id : dropoff?.id;
    return placesMock.filter(
      (p) =>
        p.id !== taken &&
        (!q || p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)),
    );
  }, [query, active, pickup, dropoff]);

  const choose = useCallback(
    (place) => {
      if (active === 'pickup') setPickup(place);
      else setDropoff(place);
      setQuery('');
      if (active === 'pickup') setActive('dropoff');
    },
    [active, setPickup, setDropoff],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, [router]);

  const activate = useCallback((field) => {
    setActive(field);
    setQuery('');
  }, []);

  return (
    <ScreenContainer>
      <ScreenHeader title="Plan your ride" onBack={goBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: BOTTOM_BAR_CONTENT + 40 },
        ]}
      >
        <RouteInputs
          pickup={pickup}
          dropoff={dropoff}
          active={active}
          query={query}
          onQuery={setQuery}
          onActivate={activate}
          onSwap={swapStops}
        />

        <View style={styles.section}>
          <SectionHeader title="WHEN" />
          <View style={styles.sectionBody}>
            <WhenChips options={options} value={when} onChange={setWhen} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title={active === 'pickup' ? 'PICKUP SUGGESTIONS' : 'SUGGESTED PLACES'}
          />
          <View style={styles.sectionBody}>
            {suggestions.map((place) => (
              <PlaceRow key={place.id} place={place} onPress={choose} />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomBar>
        <PrimaryButton
          label="Choose a ride"
          icon="car"
          disabled={!dropoff || !pickup}
          onPress={() => router.push(ROUTES.vehicles)}
        />
      </BottomBar>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: screenPadding, paddingTop: 16 },
  section: { marginTop: 24 },
  sectionBody: { marginTop: 12 },
});

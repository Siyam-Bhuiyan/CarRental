import React, { useCallback, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors, screenPadding } from '@/theme';
import { getCarImage } from '@/assets/images/cars';
import { ScreenContainer } from '@/components/layout';
import { AppText, PrimaryButton, SegmentedTabs } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { isUpcoming, useJourneysStore } from '@/store/journeysStore';
import ScreenHeader from '@/features/booking/components/ScreenHeader';
import JourneyCard from '../components/JourneyCard';

const TABS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

function EmptyState({ tab, onBook }) {
  return (
    <View style={styles.empty}>
      <Image
        source={getCarImage('graphite')}
        style={styles.emptyCar}
        resizeMode="contain"
      />
      <AppText variant="title">
        {tab === 'upcoming' ? 'No upcoming journeys' : 'No past journeys yet'}
      </AppText>
      <AppText variant="bodySm" color={colors.textMuted} style={styles.emptyText}>
        {tab === 'upcoming'
          ? 'Book a ride and it will show up here.'
          : 'Completed and cancelled rides appear here.'}
      </AppText>
      {tab === 'upcoming' && (
        <PrimaryButton
          label="Book a ride"
          icon="car"
          onPress={onBook}
          style={styles.emptyButton}
        />
      )}
    </View>
  );
}

export default function JourneysScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('upcoming');
  const journeys = useJourneysStore((s) => s.journeys);

  const list = useMemo(() => {
    const items = journeys.filter((j) =>
      tab === 'upcoming' ? isUpcoming(j) : !isUpcoming(j),
    );
    const sign = tab === 'upcoming' ? 1 : -1;
    return [...items].sort(
      (a, b) => sign * (new Date(a.scheduledAt) - new Date(b.scheduledAt)),
    );
  }, [journeys, tab]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(ROUTES.home);
  }, [router]);

  return (
    <ScreenContainer>
      <ScreenHeader title="My Journeys" onBack={goBack} />
      <View style={styles.tabs}>
        <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      </View>
      {list.length === 0 ? (
        <EmptyState tab={tab} onBook={() => router.push(ROUTES.search)} />
      ) : (
        <Animated.FlatList
          key={tab}
          data={list}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(Math.min(index, 8) * 50).duration(320)}
            >
              <JourneyCard
                journey={item}
                onPress={() => router.push(ROUTES.journey(item.id))}
              />
            </Animated.View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabs: { marginTop: 16, paddingHorizontal: screenPadding },
  list: { padding: screenPadding, gap: 12 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 6,
  },
  emptyCar: { width: 140, height: 66, opacity: 0.5, marginBottom: 12 },
  emptyText: { textAlign: 'center' },
  emptyButton: { marginTop: 16, alignSelf: 'stretch' },
});

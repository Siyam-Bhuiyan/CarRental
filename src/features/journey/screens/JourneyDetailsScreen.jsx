import React, { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenPadding } from '@/theme';
import { ScreenContainer } from '@/components/layout';
import { ROUTES } from '@/constants/routes';
import useJourney from '../hooks/useJourney';
import { cancelJourney } from '../services/journeyService';
import ActionBar, { ACTION_BAR_CONTENT_HEIGHT } from '../components/ActionBar';
import DriverStatusCard from '../components/DriverStatusCard';
import JourneyMapHeader from '../components/JourneyMapHeader';
import JourneyMeta from '../components/JourneyMeta';
import JourneySkeleton from '../components/JourneySkeleton';
import JourneyTopBar from '../components/JourneyTopBar';
import NotesSection from '../components/NotesSection';
import PaymentDetails from '../components/PaymentDetails';
import PreferenceGrid from '../components/PreferenceGrid';
import RouteSummary from '../components/RouteSummary';
import { SectionHeader } from '@/components/ui';

// Vertical rhythm between blocks, taken from the design (artboard px).
const GAP = {
  meta: 16,
  route: 14.5,
  prefs: 14,
  grid: 10,
  driver: 33,
  notes: 25.5,
  payment: 21,
};

function Section({ index, style, children }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(80 + index * 70).duration(380)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export default function JourneyDetailsScreen({ id }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { journey, route, loading } = useJourney(id);

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, [router]);

  const openPassengers = useCallback(() => router.push(ROUTES.passengers), [router]);

  const confirmCancel = useCallback(() => {
    Alert.alert('Cancel journey?', 'This will cancel your booked journey.', [
      { text: 'Keep journey', style: 'cancel' },
      {
        text: 'Cancel journey',
        style: 'destructive',
        onPress: async () => {
          await cancelJourney(id);
          goBack();
        },
      },
    ]);
  }, [id, goBack]);

  const bottomSpace = ACTION_BAR_CONTENT_HEIGHT + insets.bottom + 24;

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomSpace }}
        scrollEnabled={!loading}
      >
        {loading || !journey ? (
          <JourneySkeleton />
        ) : (
          <>
            <JourneyMapHeader
              route={route}
              origin={journey.origin.coordinate}
              destination={journey.destination.coordinate}
              status={journey.status}
            />
            <View style={styles.body}>
              <Section index={0} style={{ marginTop: GAP.meta }}>
                <JourneyMeta type={journey.type} code={journey.id} />
              </Section>
              <Section index={1} style={{ marginTop: GAP.route }}>
                <RouteSummary
                  origin={journey.origin}
                  destination={journey.destination}
                  scheduledAt={journey.scheduledAt}
                />
              </Section>
              <Section index={2} style={{ marginTop: GAP.prefs }}>
                <SectionHeader title="JOURNEY PREFERENCES" />
                <View style={{ marginTop: GAP.grid }}>
                  <PreferenceGrid
                    preferences={journey.preferences}
                    onPassengersPress={openPassengers}
                  />
                </View>
              </Section>
              {!journey.chauffeur && (
                <Section index={3} style={{ marginTop: GAP.driver }}>
                  <DriverStatusCard />
                </Section>
              )}
              <Section index={4} style={{ marginTop: GAP.notes }}>
                <NotesSection notes={journey.notes} />
              </Section>
              <Section index={5} style={{ marginTop: GAP.payment }}>
                <PaymentDetails payment={journey.payment} />
              </Section>
            </View>
          </>
        )}
      </ScrollView>
      <JourneyTopBar onBack={goBack} />
      {!loading && <ActionBar onCancel={confirmCancel} onManage={openPassengers} />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: screenPadding },
});

import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, screenPadding } from '@/theme';
import Icon from '@/components/icons/Icon';
import { ScreenContainer } from '@/components/layout';
import { AppText, Divider, PrimaryButton } from '@/components/ui';
import RouteSummary from '@/components/trip/RouteSummary';
import { ROUTES } from '@/constants/routes';
import { useJourneysStore } from '@/store/journeysStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { journeyTotal } from '@/utils/journey';
import BottomBar, { BOTTOM_BAR_CONTENT } from '../components/BottomBar';

function SuccessMark() {
  const ring = useSharedValue(0);
  const pop = useSharedValue(0);
  useEffect(() => {
    pop.value = withDelay(120, withSpring(1, { damping: 9, stiffness: 160 }));
    ring.value = withDelay(
      250,
      withSequence(withTiming(1, { duration: 700 }), withTiming(0, { duration: 0 })),
    );
  }, [pop, ring]);

  const markStyle = useAnimatedStyle(() => ({
    opacity: pop.value,
    transform: [{ scale: 0.4 + pop.value * 0.6 }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - ring.value),
    transform: [{ scale: 1 + ring.value * 0.8 }],
  }));

  return (
    <View style={styles.markWrap}>
      <Animated.View style={[styles.ring, ringStyle]} />
      <Animated.View style={[styles.mark, markStyle]}>
        <Icon name="check" color={colors.successText} />
      </Animated.View>
    </View>
  );
}

// Shown right after a successful payment.
export default function ConfirmationScreen({ id }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const journey = useJourneysStore((s) => s.journeys.find((j) => j.id === id));

  useEffect(() => {
    // the route param can arrive a frame late; only bounce once we have an id to look up
    if (id && !journey) router.replace(ROUTES.home);
  }, [id, journey, router]);

  if (!journey) return null;

  const card = journey.payment.card;
  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 48,
            paddingBottom: BOTTOM_BAR_CONTENT + 48 + 10 + 32,
          },
        ]}
      >
        <SuccessMark />
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.center}
        >
          <AppText variant="titleLg">Booking confirmed</AppText>
          <AppText variant="bodySm" color={colors.textMuted} style={styles.sub}>
            Your chauffeur and vehicle will be assigned soon. We’ll notify you once
            confirmed.
          </AppText>
          <View style={styles.idChip}>
            <AppText variant="chip" color={colors.textSecondary}>
              Journey ID · #{journey.id}
            </AppText>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(420).duration(400)} style={styles.card}>
          <RouteSummary
            origin={journey.origin}
            destination={journey.destination}
            scheduledAt={journey.scheduledAt}
          />
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <AppText variant="captionMd" color={colors.textMuted}>
              Ride
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              {journey.vehicleName ?? 'Chauffeur'}
            </AppText>
          </View>
          <View style={styles.row}>
            <AppText variant="captionMd" color={colors.textMuted}>
              Paid with
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              {card ? `${card.brand?.toUpperCase()} •••• ${card.last4}` : 'Card'}
            </AppText>
          </View>
          <View style={styles.row}>
            <AppText variant="title">Total paid</AppText>
            <AppText variant="title">{formatCurrency(journeyTotal(journey))}</AppText>
          </View>
        </Animated.View>
      </ScrollView>

      <BottomBar style={styles.bar}>
        <PrimaryButton
          label="View journey"
          icon="route"
          onPress={() => router.replace(ROUTES.journey(journey.id))}
        />
        <PrimaryButton
          label="Back to home"
          variant="secondary"
          onPress={() => router.replace(ROUTES.home)}
        />
      </BottomBar>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: screenPadding },
  center: { alignItems: 'center', marginTop: 20 },
  markWrap: { alignSelf: 'center', width: 96, height: 96 },
  ring: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
  },
  mark: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
  },
  sub: { marginTop: 8, textAlign: 'center', maxWidth: 300 },
  idChip: {
    marginTop: 14,
    height: 26,
    paddingHorizontal: 12,
    borderRadius: 13,
    justifyContent: 'center',
    backgroundColor: colors.whiteAlpha10,
  },
  card: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    gap: 10,
    backgroundColor: colors.surface,
  },
  divider: { marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bar: { gap: 10 },
});

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { colors, screenPadding, typography } from '@/theme';
import { ScreenContainer } from '@/components/layout';
import { PrimaryButton, SectionHeader } from '@/components/ui';
import RouteSummary from '@/components/trip/RouteSummary';
import { ROUTES } from '@/constants/routes';
import vehiclesMock from '@/mocks/vehicles.json';
import { useBookingStore } from '@/store/bookingStore';
import { usePayment } from '@/features/payment';
import { formatCurrency } from '@/utils/formatCurrency';
import BottomBar, { BOTTOM_BAR_CONTENT } from '../components/BottomBar';
import PaymentNotice from '../components/PaymentNotice';
import PriceBreakdown from '../components/PriceBreakdown';
import ScreenHeader from '../components/ScreenHeader';
import SelectedRide from '../components/SelectedRide';
import { createJourney } from '../services/bookingService';
import { quote } from '../services/pricing';

export default function CheckoutScreen() {
  const router = useRouter();
  const { pay, isDemo } = usePayment();
  const { pickup, dropoff, when, vehicleId, plan, notes, setNotes } = useBookingStore();
  const [paying, setPaying] = useState(false);
  const completed = useRef(false); // set once paid so resetting the draft does not redirect

  const vehicle = vehiclesMock.find((v) => v.id === vehicleId);
  const price = useMemo(
    () => (vehicle && plan ? quote(vehicle, plan) : null),
    [vehicle, plan],
  );
  const ready = Boolean(dropoff && vehicle && plan && when && price);

  // Nothing to check out (e.g. deep link): go back to the start.
  useFocusEffect(
    useCallback(() => {
      if (!ready && !completed.current) router.replace(ROUTES.home);
    }, [ready, router]),
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, [router]);

  const handlePay = useCallback(async () => {
    setPaying(true);
    try {
      const result = await pay({
        amount: price.total,
        description: `Car Rental - ${pickup.title} to ${dropoff.title}`,
        metadata: { vehicle: vehicle.id, pickup: pickup.title, dropoff: dropoff.title },
      });
      if (result.status === 'canceled') return;
      if (result.status !== 'paid') {
        Alert.alert(
          'Payment failed',
          result.message ?? 'Your card was not charged. Please try again.',
        );
        return;
      }
      const journey = await createJourney({
        pickup,
        dropoff,
        when,
        vehicle,
        notes,
        plan,
        price,
        card: result.card ?? {
          brand: 'visa',
          last4: '4242',
          expiry: '12/26',
          status: 'Active',
        },
      });
      completed.current = true;
      useBookingStore.getState().reset();
      router.replace(ROUTES.confirmation(journey.id));
    } finally {
      setPaying(false);
    }
  }, [pay, price, pickup, dropoff, when, vehicle, notes, plan, router]);

  if (!ready) return null;

  return (
    <ScreenContainer>
      <ScreenHeader title="Review & pay" onBack={goBack} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: BOTTOM_BAR_CONTENT + 32 },
          ]}
        >
          <RouteSummary
            origin={{ title: pickup.title, address: pickup.address }}
            destination={{ title: dropoff.title, address: dropoff.address }}
            scheduledAt={when.date}
          />

          <View style={styles.section}>
            <SelectedRide vehicle={vehicle} etaMin={vehicle.etaMin} onChange={goBack} />
          </View>

          <View style={styles.section}>
            <SectionHeader title="NOTES FOR YOUR CHAUFFEUR (OPTIONAL)" />
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Meet me at the main entrance…"
              placeholderTextColor={colors.textDisabled}
              multiline
              selectionColor={colors.accent}
              style={styles.notes}
            />
          </View>

          <View style={styles.section}>
            <PriceBreakdown price={price} />
          </View>

          <View style={styles.section}>
            <PaymentNotice isDemo={isDemo} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomBar>
        <PrimaryButton
          label={`Pay ${formatCurrency(price.total)}`}
          icon="lock"
          loading={paying}
          onPress={handlePay}
        />
      </BottomBar>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: screenPadding, paddingTop: 24 },
  section: { marginTop: 24 },
  notes: {
    ...typography.body,
    marginTop: 12,
    minHeight: 84,
    padding: 12,
    borderRadius: 12,
    color: colors.textSecondary,
    textAlignVertical: 'top',
    ...Platform.select({ web: { outlineStyle: 'none' } }),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

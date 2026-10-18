import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, screenPadding } from '@/theme';
import { ScreenContainer } from '@/components/layout';
import { AppText, IconButton, PrimaryButton, Skeleton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import vehiclesMock from '@/mocks/vehicles.json';
import { useBookingStore } from '@/store/bookingStore';
import RouteMap from '@/features/journey/components/RouteMap';
import BottomBar, { BOTTOM_BAR_CONTENT } from '../components/BottomBar';
import VehicleCard from '../components/VehicleCard';
import useRoutePlan from '../hooks/useRoutePlan';
import { quote } from '../services/pricing';
import { formatCurrency } from '@/utils/formatCurrency';

const MAP_HEIGHT = 300;
const MAP_PADDING = { top: 110, right: 56, bottom: 70, left: 56 };

export default function VehiclesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pickup, dropoff, plan, loading } = useRoutePlan();
  const vehicleId = useBookingStore((s) => s.vehicleId);
  const setVehicle = useBookingStore((s) => s.setVehicle);

  // Nothing to plan (e.g. deep link): go back to the start.
  // only while focused: the draft is reset after payment while this screen is still in the stack
  useFocusEffect(
    useCallback(() => {
      if (!dropoff) router.replace(ROUTES.home);
    }, [dropoff, router]),
  );

  useEffect(() => {
    if (!vehicleId) setVehicle(vehiclesMock[0].id);
  }, [vehicleId, setVehicle]);

  const prices = useMemo(
    () =>
      plan
        ? Object.fromEntries(vehiclesMock.map((v) => [v.id, quote(v, plan).total]))
        : null,
    [plan],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, [router]);

  if (!dropoff) return null;

  const route = plan?.coordinates ?? [pickup.coordinate, dropoff.coordinate];
  const selected = vehiclesMock.find((v) => v.id === vehicleId);

  return (
    <ScreenContainer>
      <View style={{ height: MAP_HEIGHT }}>
        <RouteMap
          route={route}
          origin={pickup.coordinate}
          destination={dropoff.coordinate}
          padding={MAP_PADDING}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.back, { top: insets.top + 8 }]}>
          <IconButton icon="arrowLeft" accessibilityLabel="Go back" onPress={goBack} />
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.titleRow}>
          <AppText variant="headline">Choose a ride</AppText>
          {plan ? (
            <AppText variant="bodySm" color={colors.textMuted}>
              {plan.distanceKm.toFixed(1)} km · {Math.round(plan.durationMin)} min
            </AppText>
          ) : (
            <Skeleton width={90} height={12} radius={6} />
          )}
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: BOTTOM_BAR_CONTENT + 24 },
          ]}
        >
          {vehiclesMock.map((vehicle) =>
            prices ? (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                price={prices[vehicle.id]}
                selected={vehicle.id === vehicleId}
                onPress={() => setVehicle(vehicle.id)}
              />
            ) : (
              <Skeleton key={vehicle.id} width="100%" height={84} radius={12} />
            ),
          )}
        </ScrollView>
      </View>

      <BottomBar>
        <PrimaryButton
          label={
            prices && selected
              ? `Continue · ${formatCurrency(prices[selected.id])}`
              : 'Finding the best route…'
          }
          disabled={loading || !selected}
          onPress={() => router.push(ROUTES.checkout)}
        />
      </BottomBar>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { position: 'absolute', left: 16 },
  sheet: {
    flex: 1,
    marginTop: -24,
    paddingTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.background,
  },
  titleRow: {
    paddingHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: { paddingHorizontal: screenPadding, paddingTop: 14, gap: 10 },
});

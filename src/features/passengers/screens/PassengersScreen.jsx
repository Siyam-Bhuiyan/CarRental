import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { ScreenContainer } from '@/components/layout';
import useAfterTransition from '@/hooks/useAfterTransition';
import PassengersHeader from '../components/PassengersHeader';
import PassengerRow from '../components/PassengerRow';
import PassengersSkeleton from '../components/PassengersSkeleton';
import usePassengers from '../hooks/usePassengers';

const MAX_STAGGERED = 12;

export default function PassengersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { passengers, loading, tab, setTab, toggleFavorite } = usePassengers();
  const ready = useAfterTransition();

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, [router]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <Animated.View
        entering={FadeInDown.delay(Math.min(index, MAX_STAGGERED) * 35).duration(320)}
      >
        <PassengerRow passenger={item} onToggleFavorite={toggleFavorite} />
      </Animated.View>
    ),
    [toggleFavorite],
  );

  return (
    <ScreenContainer>
      <PassengersHeader tab={tab} onTabChange={setTab} onBack={goBack} />
      {loading || !ready ? (
        <PassengersSkeleton />
      ) : (
        <Animated.FlatList
          // Re-key on tab so the staggered entrance replays when switching tabs.
          key={tab}
          data={passengers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
      <View style={[styles.homeStrip, { height: insets.bottom }]} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 8 },
  homeStrip: { backgroundColor: colors.surfaceRaised },
});

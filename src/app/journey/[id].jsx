import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { JourneyDetailsScreen } from '@/features/journey';

export default function JourneyRoute() {
  const { id } = useLocalSearchParams();
  return <JourneyDetailsScreen id={Array.isArray(id) ? id[0] : id} />;
}

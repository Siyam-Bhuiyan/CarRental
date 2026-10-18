import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ConfirmationScreen from '@/features/booking/screens/ConfirmationScreen';

export default function ConfirmationRoute() {
  const { id } = useLocalSearchParams();
  return <ConfirmationScreen id={Array.isArray(id) ? id[0] : id} />;
}

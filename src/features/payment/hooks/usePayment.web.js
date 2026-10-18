import { useCallback } from 'react';
import { demoPay } from '../services/demoPayment';

// @stripe/stripe-react-native is native-only, so the web preview simulates the payment.
export default function usePayment() {
  const pay = useCallback(() => demoPay(), []);
  return { pay, isDemo: true };
}

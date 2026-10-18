import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from '@/config/stripe';

// The provider must always be mounted (the hooks throw without it); a placeholder key is
// used in demo mode and is never sent anywhere because demo payments skip Stripe.
export default function PaymentProvider({ children }) {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY || 'pk_test_demo'}>
      {children}
    </StripeProvider>
  );
}

import { useCallback } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { isStripeConfigured } from '@/config/stripe';
import { colors } from '@/theme';
import { createPaymentIntent, retrieveCard } from '../services/stripeApi';
import { demoPay } from '../services/demoPayment';

const appearance = {
  colors: {
    primary: colors.accent,
    background: colors.surfaceRaised,
    componentBackground: colors.surfaceMuted,
    componentBorder: colors.border,
    componentDivider: colors.border,
    primaryText: colors.white,
    secondaryText: colors.textMuted,
    componentText: colors.white,
    placeholderText: colors.textDisabled,
    icon: colors.textSecondary,
    error: colors.danger,
  },
  shapes: { borderRadius: 12 },
  primaryButton: { colors: { background: colors.accent, text: colors.textOnLight } },
};

// Native payment flow: PaymentIntent -> Stripe PaymentSheet. Resolves to
// { status: 'paid' | 'canceled' | 'failed', card?, message?, demo? }.
export default function usePayment() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const pay = useCallback(
    async ({ amount, description, metadata }) => {
      if (!isStripeConfigured) return demoPay();
      try {
        const intent = await createPaymentIntent({
          amountCents: Math.round(amount * 100),
          description,
          metadata,
        });
        const init = await initPaymentSheet({
          merchantDisplayName: 'Car Rental',
          paymentIntentClientSecret: intent.client_secret,
          style: 'alwaysDark',
          appearance,
        });
        if (init.error) return { status: 'failed', message: init.error.message };

        const result = await presentPaymentSheet();
        if (result.error) {
          return result.error.code === 'Canceled'
            ? { status: 'canceled' }
            : { status: 'failed', message: result.error.message };
        }
        const card = await retrieveCard(intent.id).catch(() => null);
        return { status: 'paid', card };
      } catch (e) {
        return { status: 'failed', message: e.message };
      }
    },
    [initPaymentSheet, presentPaymentSheet],
  );

  return { pay, isDemo: !isStripeConfigured };
}

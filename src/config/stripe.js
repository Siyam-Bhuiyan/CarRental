// Stripe configuration, read from `.env` (see `.env.example`). Expo inlines
// EXPO_PUBLIC_* variables at bundle time, so restart with `npx expo start -c` after editing.
const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
const secretKey = process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY ?? '';

const looksReal = (key, prefix) => key.startsWith(prefix) && !/x{6,}/i.test(key);

export const STRIPE_PUBLISHABLE_KEY = publishableKey;
export const STRIPE_SECRET_KEY = secretKey;
export const STRIPE_API = 'https://api.stripe.com/v1';
export const CURRENCY = 'usd';

// Without both test keys the app runs payments in a clearly-labelled demo mode.
export const isStripeConfigured =
  looksReal(publishableKey, 'pk_test_') && looksReal(secretKey, 'sk_test_');

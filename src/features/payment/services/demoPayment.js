import { delay } from '@/utils/delay';

// Used when no Stripe keys are configured (and on web, where the native SDK is unavailable).
export async function demoPay() {
  await delay(1400);
  return {
    status: 'paid',
    demo: true,
    card: { brand: 'visa', last4: '4242', expiry: '12/26', status: 'Active' },
  };
}

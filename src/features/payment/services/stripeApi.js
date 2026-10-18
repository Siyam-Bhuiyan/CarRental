import { CURRENCY, STRIPE_API, STRIPE_SECRET_KEY } from '@/config/stripe';

// ⚠ Assessment shortcut: this calls the Stripe API straight from the app with a TEST secret
// key (no backend). In production the PaymentIntent must be created on a server so the
// secret key never ships in the bundle - see README.
const form = (data) =>
  Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

async function stripeRequest(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body ? form(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? 'Stripe request failed');
  return json;
}

export function createPaymentIntent({ amountCents, description, metadata = {} }) {
  const body = {
    amount: amountCents,
    currency: CURRENCY,
    description,
    'payment_method_types[]': 'card',
  };
  Object.entries(metadata).forEach(([k, v]) => {
    body[`metadata[${k}]`] = v;
  });
  return stripeRequest('/payment_intents', { method: 'POST', body });
}

// Card details of a completed PaymentIntent, for showing "•••• 4242" on the journey.
export async function retrieveCard(paymentIntentId) {
  const pi = await stripeRequest(
    `/payment_intents/${paymentIntentId}?expand[]=payment_method`,
  );
  const card = pi.payment_method?.card;
  if (!card) return null;
  return {
    brand: card.brand,
    last4: card.last4,
    expiry: `${String(card.exp_month).padStart(2, '0')}/${String(card.exp_year).slice(-2)}`,
    status: 'Active',
  };
}

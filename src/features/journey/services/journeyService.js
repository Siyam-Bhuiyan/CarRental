import journeyMock from '@/mocks/journey.json';
import { delay } from '@/utils/delay';
import { roundMoney } from '@/utils/formatCurrency';

// Swap the body of these functions for real HTTP calls; the UI only sees the returned shape.
export async function getJourney(id) {
  await delay(650);
  if (id && id !== journeyMock.id) {
    // The mock backend only knows one journey; unknown ids fall back to it.
    return withTotals({ ...journeyMock, id });
  }
  return withTotals(journeyMock);
}

export async function cancelJourney() {
  await delay(400);
  return { ok: true };
}

function withTotals(journey) {
  const { baseFare, discountPercent } = journey.payment;
  const discount = roundMoney((baseFare * discountPercent) / 100);
  return {
    ...journey,
    payment: { ...journey.payment, discount, total: roundMoney(baseFare - discount) },
  };
}

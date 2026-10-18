import { delay } from '@/utils/delay';
import { percentOf, roundMoney } from '@/utils/formatCurrency';
import { useJourneysStore } from '@/store/journeysStore';

// Swap the body of these functions for real HTTP calls; the UI only sees the returned shape.
export async function getJourney(id) {
  await delay(650);
  const { journeys } = useJourneysStore.getState();
  // The mock backend falls back to the first journey for unknown ids.
  const journey = journeys.find((j) => j.id === id) ?? journeys[0];
  return withTotals(journey);
}

export async function cancelJourney(id) {
  await delay(400);
  useJourneysStore.getState().setStatus(id, 'CANCELLED');
  return { ok: true };
}

function withTotals(journey) {
  const { baseFare, discountPercent } = journey.payment;
  const discount = percentOf(baseFare, discountPercent);
  return {
    ...journey,
    payment: { ...journey.payment, discount, total: roundMoney(baseFare - discount) },
  };
}

import { percentOf, roundMoney } from '@/utils/formatCurrency';

// First-ride welcome offer applied to every booking.
export const DISCOUNT_PERCENT = 10;
const MIN_FARE = 12;

// Price quote for one vehicle category on a planned route.
export function quote(vehicle, plan) {
  const raw =
    vehicle.baseFare +
    vehicle.perKm * plan.distanceKm +
    vehicle.perMin * plan.durationMin;
  const baseFare = roundMoney(Math.max(MIN_FARE, raw));
  const discount = percentOf(baseFare, DISCOUNT_PERCENT);
  return { baseFare, discount, total: roundMoney(baseFare - discount) };
}

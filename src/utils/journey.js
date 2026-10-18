import { colors } from '@/theme';
import { percentOf, roundMoney } from './formatCurrency';

// Total charged for a journey after the discount.
export function journeyTotal(journey) {
  const { baseFare, discountPercent } = journey.payment;
  return roundMoney(baseFare - percentOf(baseFare, discountPercent));
}

// Badge colours per journey status.
export const STATUS_STYLES = {
  BOOKED: { textColor: colors.warning, backgroundColor: colors.warningAlpha20 },
  COMPLETED: { textColor: colors.success, backgroundColor: 'rgba(34,197,94,0.15)' },
  CANCELLED: { textColor: colors.danger, backgroundColor: colors.dangerAlpha10 },
};

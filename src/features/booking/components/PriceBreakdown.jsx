import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { AppText, Badge, Divider, SectionHeader } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import { DISCOUNT_PERCENT } from '../services/pricing';

function Row({ label, amount, negative }) {
  return (
    <View style={styles.row}>
      <AppText variant="captionMd" color={colors.textMuted}>
        {label}
      </AppText>
      <AppText variant="bodySm" color={negative ? colors.danger : colors.textSecondary}>
        {formatCurrency(negative ? -amount : amount)}
      </AppText>
    </View>
  );
}

// Fare, welcome discount and total for the selected ride.
export default function PriceBreakdown({ price }) {
  return (
    <View>
      <SectionHeader
        title="FARE"
        right={
          <Badge
            label="Welcome offer"
            textColor={colors.success}
            backgroundColor="rgba(34,197,94,0.15)"
          />
        }
      />
      <View style={styles.rows}>
        <Row label="Base Fare" amount={price.baseFare} />
        <Row label={`Discount (${DISCOUNT_PERCENT}%)`} amount={price.discount} negative />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.total}>
        <AppText variant="title">Total</AppText>
        <AppText variant="title" color={colors.textSecondary}>
          {formatCurrency(price.total)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rows: { marginTop: 12, gap: 7 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { marginTop: 8 },
  total: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

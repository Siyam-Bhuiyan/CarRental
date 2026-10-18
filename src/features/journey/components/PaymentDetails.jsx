import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { AppText, Badge, Divider, SectionHeader } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import PaymentMethodCard from './PaymentMethodCard';

function FareRow({ label, amount, negative }) {
  return (
    <View style={styles.fareRow}>
      <AppText variant="captionMd" color={colors.textMuted}>
        {label}
      </AppText>
      <AppText variant="bodySm" color={negative ? colors.danger : colors.textSecondary}>
        {formatCurrency(negative ? -amount : amount)}
      </AppText>
    </View>
  );
}

export default function PaymentDetails({ payment, onChangeCard }) {
  return (
    <View>
      <SectionHeader
        title="PAYMENT DETAILS"
        right={<Badge label={payment.status} textColor={colors.textSecondary} />}
      />
      <View style={styles.fares}>
        <FareRow label="Base Fare" amount={payment.baseFare} />
        <FareRow
          label={`Discount (${payment.discountPercent}%)`}
          amount={payment.discount}
          negative
        />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.totalRow}>
        <AppText variant="title">Total</AppText>
        <AppText variant="title" color={colors.textSecondary}>
          {formatCurrency(payment.total)}
        </AppText>
      </View>
      <PaymentMethodCard card={payment.card} onChange={onChangeCard} />
    </View>
  );
}

const styles = StyleSheet.create({
  fares: { marginTop: 12, gap: 7 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { marginTop: 4.5 },
  totalRow: {
    marginTop: 1.5,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

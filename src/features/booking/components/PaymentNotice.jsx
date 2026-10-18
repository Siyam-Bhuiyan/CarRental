import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText } from '@/components/ui';

// Reassurance line under the fare; flags demo mode when no Stripe test keys are configured.
export default function PaymentNotice({ isDemo }) {
  return (
    <View style={styles.card}>
      <Icon name="lock" color={colors.accent} />
      <View style={styles.text}>
        <AppText variant="bodySmMedium">Secure card payment with Stripe</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {isDemo
            ? 'Demo mode: add Stripe test keys to .env to open the real card form.'
            : 'Test mode: use card 4242 4242 4242 4242, any future date and CVC.'}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.blackAlpha20,
  },
  text: { flex: 1, gap: 2 },
});

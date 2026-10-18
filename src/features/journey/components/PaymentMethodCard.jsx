import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, Badge, PressableScale } from '@/components/ui';

// Saved card with a diagonal gold -> grey hairline border (50% opacity, as designed).
export default function PaymentMethodCard({ card, onChange }) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[colors.accent, '#8F8FA0']}
        start={{ x: 0.12, y: -0.07 }}
        end={{ x: 0.26, y: 1.07 }}
        style={styles.border}
      />
      <View style={styles.inner} />
      <View style={styles.content}>
        <Icon name={card.brand} />
        <View style={styles.details}>
          <AppText variant="bodySmMedium">**** {card.last4}</AppText>
          <AppText variant="captionMd" color={colors.textMuted}>
            Expiry Date: {card.expiry}
          </AppText>
        </View>
        <Badge
          label={card.status}
          textColor={colors.successText}
          backgroundColor={colors.success}
        />
        <PressableScale
          onPress={onChange}
          accessibilityRole="button"
          accessibilityLabel="Change payment method"
        >
          <Badge label="Change" />
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: 62, borderRadius: 12, backgroundColor: colors.surfaceMuted },
  border: { ...StyleSheet.absoluteFillObject, borderRadius: 12, opacity: 0.5 },
  inner: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 11,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  details: { flex: 1, marginLeft: 0 },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText } from '@/components/ui';

// Shown until a chauffeur and vehicle are assigned to the journey.
export default function DriverStatusCard() {
  return (
    <View style={styles.card}>
      <Icon name="steeringWheel" color={colors.accent} style={styles.icon} />
      <View style={styles.text}>
        <AppText variant="bodySmMedium" style={styles.title}>
          Chauffeur & Vehicle Not Assigned
        </AppText>
        <AppText variant="note" color={colors.textMuted} style={styles.body}>
          Your chauffeur and vehicle will be assigned soon. We’ll notify you once
          confirmed.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 7,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: colors.blackAlpha20,
  },
  icon: { marginTop: 1 },
  text: { flex: 1 },
  title: { lineHeight: 16 },
  body: { marginTop: 0 },
});

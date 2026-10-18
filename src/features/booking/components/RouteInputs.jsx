import React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { colors, typography } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, Divider, IconButton, PressableScale } from '@/components/ui';

function StopRow({ label, value, placeholder, active, query, onQuery, onPress }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.99}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value ?? placeholder}`}
      style={styles.row}
    >
      <AppText variant="caption" color={colors.textMuted}>
        {label}
      </AppText>
      {active ? (
        <TextInput
          value={query}
          onChangeText={onQuery}
          placeholder={value ?? placeholder}
          placeholderTextColor={value ? colors.textSecondary : colors.textDisabled}
          autoFocus
          selectionColor={colors.accent}
          style={styles.input}
        />
      ) : (
        <AppText
          variant="bodyMedium"
          color={value ? colors.white : colors.textDisabled}
          numberOfLines={1}
        >
          {value ?? placeholder}
        </AppText>
      )}
    </PressableScale>
  );
}

// Pickup / drop-off card with the connecting rail. The active row is a text field that
// filters the suggestions below it.
export default function RouteInputs({
  pickup,
  dropoff,
  active,
  query,
  onQuery,
  onActivate,
  onSwap,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.rail}>
        <View style={styles.dot} />
        <View style={styles.line} />
        <Icon name="mapPin" color={colors.accent} size={20} />
      </View>
      <View style={styles.rows}>
        <StopRow
          label="Pickup"
          value={pickup?.title}
          placeholder="Where from?"
          active={active === 'pickup'}
          query={query}
          onQuery={onQuery}
          onPress={() => onActivate('pickup')}
        />
        <Divider />
        <StopRow
          label="Drop-off"
          value={dropoff?.title}
          placeholder="Where to?"
          active={active === 'dropoff'}
          query={query}
          onQuery={onQuery}
          onPress={() => onActivate('dropoff')}
        />
      </View>
      <IconButton
        icon="swap"
        variant="ghost"
        accessibilityLabel="Swap pickup and drop-off"
        onPress={onSwap}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rail: { width: 20, alignItems: 'center', justifyContent: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white },
  line: { width: 1, height: 30, backgroundColor: colors.border },
  rows: { flex: 1, marginLeft: 10 },
  row: { height: 56, justifyContent: 'center' },
  input: {
    ...typography.bodyMedium,
    color: colors.white,
    padding: 0,
    margin: 0,
    height: 22,
    includeFontPadding: false,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
});

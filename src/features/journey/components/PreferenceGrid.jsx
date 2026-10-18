import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, PressableScale } from '@/components/ui';

const DIMMED_VALUES = ['No Need', 'No'];

function PreferenceItem({ icon, value, label, onPress, width }) {
  const dimmed = DIMMED_VALUES.includes(String(value));
  const content = (
    <View style={[styles.item, width ? { width } : styles.flex]}>
      <Icon name={icon} />
      <View>
        <AppText variant="bodyMedium" color={dimmed ? colors.textDisabled : colors.white}>
          {value}
        </AppText>
        <AppText variant="captionMd" color={colors.textMuted}>
          {label}
        </AppText>
      </View>
    </View>
  );
  if (!onPress) return content;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
      style={width ? { width } : styles.flex}
    >
      {content}
    </PressableScale>
  );
}

// 3 x 2 grid of journey preferences. Column widths follow the design's 122pt pitch.
export default function PreferenceGrid({ preferences, onPassengersPress }) {
  const items = [
    {
      icon: 'users',
      value: preferences.passengers,
      label: 'Passenger',
      onPress: onPassengersPress,
    },
    { icon: 'bag', value: preferences.carryOnBags, label: 'Carry-on Bags' },
    { icon: 'suitcase', value: preferences.largeBags, label: 'Large Bags' },
    { icon: 'boosterSeat', value: preferences.childSeat, label: 'Child Seat' },
    {
      icon: 'accessible',
      value: preferences.accessibleVehicle,
      label: 'Accessible Veh.',
    },
    { icon: 'paw', value: preferences.petFriendly, label: 'Pet Friendly' },
  ];
  const rows = [items.slice(0, 3), items.slice(3)];

  return (
    <View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, rowIndex > 0 && styles.rowGap]}>
          {row.map((item, colIndex) => (
            <PreferenceItem
              key={item.label}
              {...item}
              width={colIndex < 2 ? 122 : undefined}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rowGap: { marginTop: 27 },
  flex: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 9 },
});

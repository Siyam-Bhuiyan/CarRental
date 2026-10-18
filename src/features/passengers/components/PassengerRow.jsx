import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, screenPadding } from '@/theme';
import Icon from '@/components/icons/Icon';
import { AppText, Avatar, PressableScale } from '@/components/ui';
import { getAvatar } from '@/assets/images/avatars';
import StarToggle from './StarToggle';

export const ROW_HEIGHT = 72;

function PassengerRow({ passenger, onToggleFavorite, onEdit }) {
  return (
    <View style={styles.row}>
      <Avatar source={getAvatar(passenger.avatar)} size={40} />
      <View style={styles.info}>
        <AppText variant="bodyMedium" numberOfLines={1}>
          {passenger.name}
        </AppText>
        <AppText variant="bodySm" color={colors.textMuted}>
          {passenger.phone}
        </AppText>
      </View>
      <View style={styles.actions}>
        <StarToggle
          active={passenger.favorite}
          onPress={() => onToggleFavorite(passenger.id)}
          label={`${passenger.favorite ? 'Remove' : 'Add'} ${passenger.name} as favourite`}
        />
        <PressableScale
          onPress={() => onEdit?.(passenger)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${passenger.name}`}
          style={styles.edit}
        >
          <Icon name="edit" color={colors.textSecondary} />
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    marginHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: { flex: 1, marginLeft: 13, gap: 1 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  // The 16pt pencil glyph sits in a 24pt box; pull it right so the glyph aligns to the gutter.
  edit: { width: 24, height: 24, marginLeft: 10, marginRight: -2 },
});

export default memo(PassengerRow);

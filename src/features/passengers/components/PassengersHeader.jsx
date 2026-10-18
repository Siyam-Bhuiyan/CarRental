import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, screenPadding } from '@/theme';
import { AppText, HeaderBackButton, IconButton, SegmentedTabs } from '@/components/ui';

const TABS = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

// Title row (back / title / add) plus the filter · segmented tabs · search toolbar.
export default function PassengersHeader({
  tab,
  onTabChange,
  onBack,
  onAdd,
  onFilter,
  onSearch,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 8 }}>
      <View style={styles.titleRow}>
        <HeaderBackButton onPress={onBack} />
        <AppText variant="headline" style={styles.title}>
          All Passengers
        </AppText>
        <IconButton icon="plus" accessibilityLabel="Add passenger" onPress={onAdd} />
      </View>
      <View style={styles.toolbar}>
        <IconButton
          icon="filter"
          variant="ghost"
          accessibilityLabel="Filter"
          onPress={onFilter}
        />
        <SegmentedTabs
          tabs={TABS}
          value={tab}
          onChange={onTabChange}
          style={styles.tabs}
        />
        <IconButton
          icon="search"
          variant="ghost"
          accessibilityLabel="Search"
          onPress={onSearch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 },
  title: { flex: 1, color: colors.white },
  toolbar: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabs: { flex: 1 },
});

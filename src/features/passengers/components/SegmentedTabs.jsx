import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, typography } from '@/theme';

const INSET = 4;

function TabLabel({ label, index, progress }) {
  // progress runs 0..1 between the two tabs; tab `index` is "on" when progress === index.
  const animatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      Math.abs(progress.value - index),
      [0, 1],
      [colors.textOnLight, colors.textSecondary],
    ),
  }));
  return (
    <Animated.Text allowFontScaling={false} style={[styles.label, animatedStyle]}>
      {label}
    </Animated.Text>
  );
}

// Two-option segmented control with a sliding white pill.
export default function SegmentedTabs({ tabs, value, onChange, style }) {
  const [width, setWidth] = useState(0);
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.value === value),
  );
  const progress = useSharedValue(activeIndex);

  useEffect(() => {
    progress.value = withSpring(activeIndex, { damping: 18, stiffness: 220, mass: 0.8 });
  }, [activeIndex, progress]);

  const pillWidth = Math.max(0, (width - INSET * 2) / tabs.length);
  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * pillWidth }],
  }));

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View style={[styles.pill, { width: pillWidth }, pillStyle]} />
      {tabs.map((tab, index) => (
        <Pressable
          key={tab.value}
          style={styles.tab}
          onPress={() => onChange(tab.value)}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab.value === value }}
        >
          <TabLabel label={tab.label} index={index} progress={progress} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 20,
    padding: INSET,
    flexDirection: 'row',
    backgroundColor: 'rgba(36,36,40,0.2)',
  },
  pill: {
    position: 'absolute',
    top: INSET,
    left: INSET,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { ...typography.bodyMedium, includeFontPadding: false },
});

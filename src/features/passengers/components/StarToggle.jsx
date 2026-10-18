import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/theme';
import Icon from '@/components/icons/Icon';
import { PressableScale } from '@/components/ui';

// Favourite star: filled green when on, outlined grey when off, with a springy pop on toggle.
export default function StarToggle({ active, onPress, label }) {
  const pop = useSharedValue(1);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pop.value = withSequence(
      withSpring(1.35, { damping: 6, stiffness: 400 }),
      withSpring(1),
    );
  }, [active, pop]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  return (
    <PressableScale
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={styles.target}
    >
      <Animated.View style={animatedStyle}>
        <Icon
          name={active ? 'starFilled' : 'starOutline'}
          color={active ? colors.success : colors.textDisabled}
        />
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  target: { width: 20, height: 20 },
});

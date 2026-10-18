import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '@/theme';

// The design has three heavily blurred blobs (gold / white / gold, 50% opacity) behind
// the content. A Gaussian blur of that size is visually a soft radial falloff, so we draw
// radial gradients in artboard space (402x922) and stretch them to the screen.
const BLOBS = [
  { id: 'gold1', cx: 332, cy: 604, color: colors.accent },
  { id: 'white', cx: 170, cy: 822, color: colors.white },
  { id: 'gold2', cx: 70, cy: 668, color: colors.accent },
];
const RADIUS = 210;
const PEAK = 0.19;

export default function GlowBackground() {
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      viewBox="0 0 402 922"
      preserveAspectRatio="none"
      pointerEvents="none"
    >
      <Defs>
        {BLOBS.map(({ id, color }) => (
          <RadialGradient
            key={id}
            id={id}
            gradientUnits="objectBoundingBox"
            cx="0.5"
            cy="0.5"
            r="0.5"
          >
            <Stop offset="0" stopColor={color} stopOpacity={PEAK} />
            <Stop offset="0.35" stopColor={color} stopOpacity={PEAK * 0.62} />
            <Stop offset="0.65" stopColor={color} stopOpacity={PEAK * 0.2} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {BLOBS.map(({ id, cx, cy }) => (
        <Rect
          key={id}
          x={cx - RADIUS}
          y={cy - RADIUS}
          width={RADIUS * 2}
          height={RADIUS * 2}
          fill={`url(#${id})`}
        />
      ))}
    </Svg>
  );
}

import React from 'react';
import { Image } from 'expo-image';

export default function Avatar({ source, size = 40, style }) {
  return (
    <Image
      source={source}
      transition={150}
      contentFit="cover"
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
    />
  );
}

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { CAR_ASPECT, getCarImage } from '@/assets/images/cars';
import { MapMarker, useMap } from '@/components/map';
import useNearbyCars from '../hooks/useNearbyCars';

const BASE_WIDTH = 26;

// Top-down car markers, rotated to their heading. The art faces right, so a heading of 0
// (north) needs a -90deg turn.
export default function NearbyCars({ center, active }) {
  const { zoom } = useMap();
  // state lives here so only the cars re-render on each tick, not the whole home screen
  const cars = useNearbyCars(center, active);
  const width = Math.round(
    BASE_WIDTH * Math.min(1.5, Math.max(0.7, 2 ** ((zoom - 15) * 0.6))),
  );
  const height = Math.round(width / CAR_ASPECT);
  return cars.map((car) => (
    <MapMarker
      key={car.id}
      coordinate={car.coordinate}
      width={width}
      height={height}
      rotation={car.heading - 90}
    >
      <View style={styles.shadow}>
        <Image
          source={getCarImage(car.image)}
          style={{ width, height }}
          resizeMode="contain"
        />
      </View>
    </MapMarker>
  ));
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

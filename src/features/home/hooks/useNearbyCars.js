import { useEffect, useState } from 'react';

const IMAGES = [
  'pearl',
  'blue',
  'graphite',
  'pearl',
  'red',
  'blue',
  'pearl',
  'graphite',
  'blue',
];
const M_PER_DEG = 111320;
const STEP_M = 16; // metres moved per tick
const TICK_MS = 1200;
const MAX_RADIUS_M = 1100;

// Deterministic pseudo-random so the layout is stable between reloads.
const rand = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const metresBetween = (a, b, lat) => {
  const dy = (b.latitude - a.latitude) * M_PER_DEG;
  const dx = (b.longitude - a.longitude) * M_PER_DEG * Math.cos((lat * Math.PI) / 180);
  return { dx, dy, dist: Math.hypot(dx, dy) };
};

function seedCars(center) {
  return IMAGES.map((image, i) => {
    const angle = ((i + rand(i + 1) * 0.8) / IMAGES.length) * Math.PI * 2;
    const radius = 260 + rand(i + 40) * 700;
    return {
      id: `car-${i}`,
      image,
      heading: Math.round(rand(i + 80) * 360),
      coordinate: {
        latitude: center.latitude + (Math.cos(angle) * radius) / M_PER_DEG,
        longitude:
          center.longitude +
          (Math.sin(angle) * radius) /
            (M_PER_DEG * Math.cos((center.latitude * Math.PI) / 180)),
      },
    };
  });
}

// Mock "drivers nearby": cars drift along their heading and turn back toward the centre
// when they wander too far. Replace with a realtime feed in production.
export default function useNearbyCars(center) {
  const [cars, setCars] = useState(() => seedCars(center));

  useEffect(() => {
    const id = setInterval(() => {
      setCars((list) =>
        list.map((car, i) => {
          const rad = (car.heading * Math.PI) / 180;
          const coordinate = {
            latitude: car.coordinate.latitude + (Math.cos(rad) * STEP_M) / M_PER_DEG,
            longitude:
              car.coordinate.longitude +
              (Math.sin(rad) * STEP_M) /
                (M_PER_DEG * Math.cos((car.coordinate.latitude * Math.PI) / 180)),
          };
          const { dx, dy, dist } = metresBetween(center, coordinate, center.latitude);
          let heading = car.heading;
          if (dist > MAX_RADIUS_M) {
            // steer back toward the centre (bearing of the vector pointing at it) + a little jitter
            const toCentre = (Math.atan2(-dx, -dy) * 180) / Math.PI;
            const jitter = (rand(i + Math.floor(Date.now() / 5000)) - 0.5) * 50;
            heading = (toCentre + 360 + jitter) % 360;
          }
          return { ...car, coordinate, heading };
        }),
      );
    }, TICK_MS);
    return () => clearInterval(id);
  }, [center]);

  return cars;
}

// Top-down car art, cut out of the supplied "car model" image and tinted per category.
const cars = {
  graphite: require('./suv.png'),
  pearl: require('./suv-pearl.png'),
  blue: require('./suv-blue.png'),
  red: require('./suv-red.png'),
};

// intrinsic ratio of the cut-out (664 x 312)
export const CAR_ASPECT = 664 / 312;

export const getCarImage = (key) => cars[key] ?? cars.graphite;

export default cars;

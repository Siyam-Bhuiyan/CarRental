import { Dimensions, PixelRatio } from 'react-native';

// The Figma artboard is 402pt wide. Every measurement in the design is authored at that
// width, so `scale` converts a design value to the current device width.
export const DESIGN_WIDTH = 402;
const MAX_SCALE = 1.25; // keep tablets / foldables from blowing the layout up

const { width } = Dimensions.get('window');
const ratio = Math.min(width / DESIGN_WIDTH, MAX_SCALE);

export const scale = (size) => PixelRatio.roundToNearestPixel(size * ratio);

// Fonts scale more gently than layout so text never grows past the design intent.
export const scaleFont = (size) => Math.round(size * (1 + (ratio - 1) * 0.5) * 100) / 100;

export const screenWidth = width;

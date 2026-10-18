import { scaleFont } from './layout';

export const fontFamily = {
  regular: 'Figtree_400Regular',
  medium: 'Figtree_500Medium',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
};

// Sizes are the ones measured from the glyph outlines in the Figma export.
const t = (family, size, lineHeight, extra) => ({
  fontFamily: fontFamily[family],
  fontSize: scaleFont(size),
  lineHeight: scaleFont(lineHeight),
  ...extra,
});

const typography = {
  headline: t('medium', 19, 24),
  titleLg: t('bold', 24, 28),
  title: t('semibold', 14.5, 18),
  subtitle: t('semibold', 13.2, 16),
  subtitleSm: t('semibold', 12.6, 16),
  button: t('medium', 17, 20),
  bodyMedium: t('medium', 14.5, 18),
  body: t('regular', 14.5, 20),
  bodySm: t('regular', 12.3, 16),
  bodySmMedium: t('medium', 12.5, 16),
  caption: t('regular', 10.3, 14),
  captionMd: t('regular', 11.5, 15),
  label: t('regular', 11.3, 14),
  labelTracked: t('regular', 11.3, 14, { letterSpacing: 1.6 }),
  chip: t('medium', 11.2, 14),
  note: t('regular', 11.6, 14),
};

export default typography;

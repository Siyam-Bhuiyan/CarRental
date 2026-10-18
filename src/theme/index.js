import colors from './colors';
import typography, { fontFamily } from './typography';
import { spacing, screenPadding, radii } from './spacing';
import { scale, scaleFont, DESIGN_WIDTH, screenWidth } from './layout';

export { colors, typography, fontFamily, spacing, screenPadding, radii };
export { scale, scaleFont, DESIGN_WIDTH, screenWidth };

const theme = { colors, typography, spacing, screenPadding, radii };
export default theme;

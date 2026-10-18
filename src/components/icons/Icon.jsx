import React, { memo } from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import icons from './iconData';

const TAGS = { path: Path, rect: Rect, circle: Circle };

// Renders one of the Figma icons by name. `size` scales the icon's natural box
// (width stays proportional to height for non-square icons such as `visa`).
function Icon({ name, color = '#FFFFFF', size, style }) {
  const icon = icons[name];
  if (!icon) return null;

  const ratio = size ? size / icon.height : 1;
  return (
    <Svg
      fill="none"
      width={icon.width * ratio}
      height={icon.height * ratio}
      viewBox={icon.viewBox}
      style={style}
    >
      {icon.shapes.map(({ type, props }, index) => {
        const Shape = TAGS[type];
        const resolved = { ...props };
        if (resolved.stroke === '@color') resolved.stroke = color;
        if (resolved.fill === '@color') resolved.fill = color;
        return <Shape key={index} {...resolved} />;
      })}
    </Svg>
  );
}

export default memo(Icon);

// Icons for the booking flow, drawn in the same style as the Figma set: 24pt box,
// 1.5pt round-capped strokes. "@color" is replaced by the Icon component's color prop.
const stroke = (d, extra = {}) => ({
  type: 'path',
  props: {
    d,
    stroke: '@color',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...extra,
  },
});
const circle = (cx, cy, r, extra = {}) => ({
  type: 'circle',
  props: {
    cx,
    cy,
    r,
    stroke: '@color',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...extra,
  },
});
const icon = (...shapes) => ({ viewBox: '0 0 24 24', width: 24, height: 24, shapes });

const extraIcons = {
  chevronRight: icon(stroke('M9.5 6l6 6-6 6')),
  close: icon(stroke('M6.5 6.5l11 11M17.5 6.5l-11 11')),
  check: icon(stroke('M5 12.5l4.5 4.5L19 7.5')),
  calendar: icon(
    stroke('M7 4.5h10a3 3 0 013 3V17a3 3 0 01-3 3H7a3 3 0 01-3-3V7.5a3 3 0 013-3z'),
    stroke('M8 3v3M16 3v3M4 10h16'),
  ),
  clock: icon(circle(12, 12, 8.5), stroke('M12 7.5V12l3 2')),
  locate: icon(
    circle(12, 12, 3),
    circle(12, 12, 7.5),
    stroke('M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3'),
  ),
  car: icon(
    stroke('M4.5 17v-5l1.7-4.6A2 2 0 018.1 6h7.8a2 2 0 011.9 1.4L19.5 12v5'),
    stroke('M4.5 12h15M4.5 17h15M7 17v2M17 17v2'),
    circle(8, 14.5, 0.6, { fill: '@color' }),
    circle(16, 14.5, 0.6, { fill: '@color' }),
  ),
  wallet: icon(
    stroke('M6.5 6.5h11a3 3 0 013 3v7a3 3 0 01-3 3h-11a3 3 0 01-3-3v-7a3 3 0 013-3z'),
    stroke('M3.5 9.5V8a2.5 2.5 0 012.5-2.5h9'),
    circle(16.5, 13, 0.8, { fill: '@color' }),
  ),
  user: icon(circle(12, 8.5, 3.5), stroke('M5 19.5c.8-3.2 3.7-5 7-5s6.2 1.8 7 5')),
  receipt: icon(
    stroke(
      'M7 3.5h10a2 2 0 012 2V20l-2.5-1.5L14 20l-2-1.5L10 20l-2.5-1.5L5 20V5.5a2 2 0 012-2z',
    ),
    stroke('M9 8.5h6M9 12h6'),
  ),
  swap: icon(
    stroke('M7 4.5v13M3.5 14l3.5 3.5L10.5 14'),
    stroke('M17 19.5v-13M13.5 10L17 6.5l3.5 3.5'),
  ),
  bolt: icon(stroke('M13 3L5.5 13.5H12L11 21l7.5-10.5H12z')),
  lock: icon(
    stroke('M7 10.5h10a2 2 0 012 2V18a2 2 0 01-2 2H7a2 2 0 01-2-2v-5.5a2 2 0 012-2z'),
    stroke('M8.5 10.5V8a3.5 3.5 0 017 0v2.5'),
  ),
  seat: icon(
    stroke('M8 4.5l1.2 7.5h6.3a2 2 0 011.9 2.6L17 18H9'),
    stroke('M8.8 18H6M10 12.5l-2 .5'),
  ),
  navigation: icon(stroke('M4 11.5L20 4l-7.5 16-2-6.5z')),
};

export default extraIcons;

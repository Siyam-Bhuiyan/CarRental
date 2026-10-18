# Car Rental – Journey & Passengers (Expo / React Native, JavaScript)

Two screens of a ride-booking style car-rental app, built to match the Figma exports in
[`design/`](design):

| Screen | Route | Design file |
| --- | --- | --- |
| Journey – Upcoming (map, preferences, payment, action bar) | `/journey/[id]` | `design/Journey - Upcoming.svg` |
| My Passengers (segmented tabs, favourites, list) | `/passengers` | `design/My Passengers.svg` |

Stack: **Expo SDK 57**, **expo-router**, **react-native-reanimated**, **react-native-svg**,
**expo-linear-gradient**, **expo-image**. JavaScript only (no TypeScript).

## Run

```bash
npm install
npx expo start        # scan the QR with Expo Go (SDK 57)
npm run lint
npm run format
```

The map works in **Expo Go with no API key**. The app opens on the journey screen; tap
the "2 Passenger" tile or **Manage Journey** to reach the passengers screen.

## Architecture

```
src/
├── app/                      # expo-router routes – thin wrappers only
│   ├── _layout.jsx           # fonts, gesture root, safe-area provider, stack
│   ├── index.jsx             # redirects to the demo journey
│   ├── journey/[id].jsx
│   └── passengers/index.jsx
├── features/                 # feature modules, each self-contained
│   ├── journey/
│   │   ├── components/       # RouteMap, JourneyMapHeader, JourneyMeta, RouteSummary,
│   │   │                     # PreferenceGrid, DriverStatusCard, NotesSection,
│   │   │                     # PaymentDetails, PaymentMethodCard, ActionBar, JourneySkeleton
│   │   ├── hooks/useJourney.js
│   │   ├── services/         # journeyService, routeService (mock-backed)
│   │   └── screens/JourneyDetailsScreen.jsx
│   └── passengers/
│       ├── components/       # PassengersHeader, SegmentedTabs, PassengerRow, StarToggle, skeleton
│       ├── hooks/usePassengers.js
│       ├── services/passengersService.js
│       └── screens/PassengersScreen.jsx
├── components/               # shared UI kit
│   ├── ui/                   # AppText, IconButton, HeaderBackButton, Avatar, Badge,
│   │                         # Divider, SectionHeader, Skeleton, PressableScale
│   ├── layout/               # ScreenContainer, GlowBackground
│   └── icons/                # Icon + iconData (extracted from the Figma SVGs)
├── theme/                    # colors, typography, spacing/radii, layout (scale helper)
├── config/map.js             # tile URL, route style, attribution
├── constants/routes.js
├── mocks/                    # journey.json, route.json, passengers.json
├── utils/                    # formatCurrency, formatDate, delay
└── assets/images/avatars/    # avatars extracted from the passengers design
```

### Principles

- **Routes are thin.** Files in `src/app` only wire a route to a screen.
- **Screens compose; hooks fetch; services talk to data.** Swapping mocks for a real API
  only touches `features/*/services`.
- **Feature modules are self-contained** and expose their screen through `index.js`.
- **Design tokens live in `theme/`.** Colors, type sizes and spacing were measured from the
  SVGs (e.g. background `#030303`, accent `#EFBF04`, danger `#EF4444`, success `#22C55E`).
  Components do not hard-code colors.
- **Reusable kit.** Both screens share icon buttons, badges, dividers, section headers,
  skeletons and the pressable-scale feedback.
- **Path alias** `@/` → `src/` (babel `module-resolver` + `jsconfig.json`).

### Matching the design

- Designs are 402×922. `theme/layout.js` exposes `scale()` relative to a 402pt base.
- Icons were extracted from the SVG paths (`iconData.js`) so they are pixel-identical, and
  rendered with `react-native-svg`.
- Font sizes were solved from the outlined glyph widths in the SVGs; the typeface that best
  matches is **Figtree** (the SVG text is converted to outlines, so the font name is not
  recoverable from the file).
- The faint golden glow is three blurred blobs in the design; `GlowBackground` reproduces
  them with radial gradients.
- Animations: staggered section/row entrances, springy press feedback, a sliding segmented
  indicator with colour interpolation, a pop on the favourite star, pulsing skeleton loaders.

### Map

`RouteMap` is a small slippy-map renderer used on iOS, Android and web: Web Mercator maths
picks the zoom that fits the route, **Esri World Dark Gray Canvas** raster tiles (no API key,
no billing) are laid out with `<Image>`, and the route (white line with a soft glow) plus the
origin/destination markers are drawn with `react-native-svg`. The map is only a header, so it
is non-interactive. The tile URL, route style and attribution live in `src/config/map.js`.

I started with `react-native-maps` + `UrlTile`, but in Expo Go on Android the native Google
map showed an empty base map with no tiles or overlays. Rendering the tiles in JS removes the
dependency on a native map SDK, so it looks the same in Expo Go, a dev build and the browser.

`routeService` returns a hard-coded route for the assessment; replace it with an OSRM/routing
call that returns `[{ latitude, longitude }]` and nothing else changes.

> I first tried CARTO Dark Matter, but it now returns an "API key required" placeholder tile,
> so I switched to Esri's keyless dark-grey basemap. Public keyless tiles are fine for an
> assessment but not for heavy production use; in production I would use MapLibre (dev build)
> with a hosted tile provider and a key.

### Notes & trade-offs

- The passengers design has a few inconsistent rows (e.g. a smaller name size on one row).
  The implementation uses one consistent style for every row.
- The status bar, time and home indicator in the designs are drawn by the OS, so they are
  not re-created; safe-area insets position the content instead.
- Data is mock-only; state is local to each feature hook (no global store is needed for two
  screens).

# Car Rental – Journey & Passengers (Expo / React Native, JavaScript)

Two screens of a ride-booking style car-rental app, built to match the Figma exports in
[`design/`](design):

| Screen | Route | Design file |
| --- | --- | --- |
| Journey – Upcoming (map, preferences, payment, action bar) | `/journey/[id]` | `design/Journey - Upcoming.svg` |
| My Passengers (segmented tabs, favourites, list) | `/passengers` | `design/My Passengers.svg` |

Stack: **Expo SDK 57**, **expo-router**, **react-native-reanimated**, **react-native-svg**,
**expo-linear-gradient**, **expo-image**, **Zustand**, **Stripe**. JavaScript only (no TypeScript).

## Run

```bash
npm install
npx expo start        # scan the QR with Expo Go (SDK 57)
npm run lint
npm run format
```

The map works in **Expo Go with no API key**. The app opens on the Home screen; the journey
and passengers screens are reachable from its "Upcoming journey" card and the shortcut tiles.

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

## Booking flow

Beyond the two assessment screens (Journey, Passengers) the app has a full booking flow:

| Screen | Route | What it does |
| --- | --- | --- |
| Home | `/` | Interactive dark map (pan / pinch), nearby cars, "Where to?" sheet, upcoming journey |
| Plan your ride | `/search` | Pickup / drop-off fields, time presets, suggested places |
| Choose a ride | `/vehicles` | Real driving route (OSRM), 4 ride categories priced from distance and time |
| Review & pay | `/checkout` | Route summary, notes, fare breakdown, Stripe payment |
| Booking confirmed | `/confirmation/[id]` | Animated success state and receipt |
| My Journeys | `/journeys` | Upcoming / Past tabs |

A paid booking is added to the journeys store and opens in the existing Journey screen.

New code lives in `features/home`, `features/booking`, `features/journeys`, `features/payment`,
`components/map` (reusable `TileMap`, `MapMarker`, `MapPolyline`) and `store/` (Zustand:
`bookingStore` for the draft, `journeysStore` for saved journeys).

## Stripe payments (test mode, no backend)

Card payments use Stripe's **PaymentSheet** through `@stripe/stripe-react-native` (works in
Expo Go; Apple/Google Pay need a dev build).

1. Create a free account at <https://dashboard.stripe.com/register>.
2. In the dashboard make sure **Test mode / Sandbox** is on, then open
   **Developers → API keys**.
3. Copy the **Publishable key** (`pk_test_…`) and reveal the **Secret key** (`sk_test_…`).
4. Copy `.env.example` to `.env` and paste both keys:

   ```
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   EXPO_PUBLIC_STRIPE_SECRET_KEY=sk_test_...
   ```

5. Restart with `npx expo start -c` (Expo inlines `EXPO_PUBLIC_*` variables at bundle time).
6. At checkout use the test card `4242 4242 4242 4242`, any future expiry and any CVC.

Without keys the app runs in a labelled **demo mode** that simulates a successful payment, so
the whole flow can still be shown. The web preview always uses demo mode.

> **Security note.** To avoid running a server for this assessment, the app creates the
> PaymentIntent itself with the test *secret* key (`features/payment/services/stripeApi.js`).
> A secret key must never ship inside a real app: in production, create the PaymentIntent on a
> backend (one `POST /payment-intent` endpoint) and give the app only the publishable key and the
> returned client secret. Only ever use `sk_test_` keys here; `.env` is git-ignored.

### Notes & trade-offs

- The passengers design has a few inconsistent rows (e.g. a smaller name size on one row).
  The implementation uses one consistent style for every row.
- The status bar, time and home indicator in the designs are drawn by the OS, so they are
  not re-created; safe-area insets position the content instead.
- Data is mock-only; state is local to each feature hook (no global store is needed for two
  screens).

# RN Weather App (Expo + TypeScript)

A cross-platform (iOS/Android) weather app built with Expo, TypeScript, Redux Toolkit + RTK Query, and OpenWeatherMap.
It auto-detects user location, shows current weather, hourly, and 5-day forecast, supports search & favorites, offline cache, dark mode, and includes unit tests.

## Features

📍 Geolocation (Expo Location) → fetch current weather for your position

🔎 City search with favorites (persisted)

🌤 Current + Hourly (today) + 5-Day forecast with icons

🔄 Pull-to-refresh, clean loading & error states

⚙️ Units toggle (°C/°F)

💾 Offline support: last successful bundle cached in AsyncStorage and returned on network errors

🌙 Dark mode (system / light / dark)

🎞 Subtle animations (card fade-in, layout transitions)

🧪 Unit tests (transform, API endpoints, formatters, cache)

🧹 ESLint + Prettier configured

## Tech Stack

- UI: React Native (Expo SDK), Functional Components + Hooks
- State: Redux Toolkit (slice for UI), RTK Query for data fetching
- Types: TypeScript end-to-end
- Networking: OpenWeatherMap API (free tier)
- Offline: AsyncStorage cache fallback + redux-persist for UI state (favorites/units/theme)
- Tests: Jest + jest-expo, RTL-ready setup
- Theming: Navigation theme + custom theme hook (useTheme)

## Getting Started

1) Prerequisites
   - Node 18+ (Node 20 recommended)
   - Expo CLI (npm i -g expo-cli) optional but handy
   - iOS Simulator (Xcode) or Android Emulator (Android Studio), or a real device with Expo Go

2) Clone & Install

   ```bash
   git clone git@github.com:<your-username>/<repo>.git
   cd <repo>
   yarn
   ```
3) Configure environment

We read secrets via Expo extra (so they’re available in both Expo Go and native builds).
Create .env and set your keys:
   ```bash
   OWM_API_KEY=your_openweathermap_key
  API_BASE_URL=https://api.openweathermap.org/data/2.5
   ```

4) Run (development)
   ```bash
   npx expo start -c
   ```
- Press i for iOS simulator or a for Android emulator
- Or scan the QR with Expo Go on your device
- On first run, iOS/Android will ask for Location permission — allow it to see local weather.

## Project Structure

```python
app/
  _layout.tsx           # Expo Router root & ThemeProvider
  (tabs)/
    index.tsx           # Home
    settings.tsx        # Settings screen
src/
  components/
    forecast-list/
    hourly-list/
    search-bar/
    favorite-cities-bar/
    weather-card/
  constants/
    theme.ts            # useTheme(), theme tokens
  features/
    weather/
      weather.slice.ts  # UI slice: units, themeMode, favorites
      types.ts          # WeatherBundle, Units, etc.
  services/
    weather.api.ts      # RTK Query endpoints (city/coords)
    transform.ts        # OWM → WeatherBundle
    owm.types.ts        # (optional) OWM minimal typings
  store/
    store.ts            # Redux store + redux-persist
  utils/
    cache.ts            # AsyncStorage cacheSet/cacheGet
    format.ts           # formatTemp/Hour/Day/Wind
  screens/
    Settings/
      SettingsScreen.tsx
      styles.ts
__tests__/
  weather.api.test.ts
  cache.test.ts
  format.test.ts
  transform.utc.test.ts
jest.config.js
jest.setup-files.js
jest.setup.ts
babel.config.js
.eslintrc.cjs
.prettierrc
.env.example
README.md
```

## Architecture & Data Flow

```csharp
                   ┌──────────────────────┐
                   │  Expo Router (UI)    │
                   │  Home / Settings     │
                   └─────────┬────────────┘
                             │
                     React Redux Provider
                             │
                 ┌───────────┴───────────┐
                 │       Redux Store     │
                 │  weather slice (UI)   │
                 │  RTK Query: weatherApi│
                 └───────────┬───────────┘
                             │
                  weatherApi.endpoints
                (getByCity / getByCoords)
              ┌──────────────┬───────────────┐
              │              │               │
           fetch()        transform()    cacheSet()
       OWM /weather       OWM→bundle      AsyncStorage
       OWM /forecast
              │                               ▲
              └──────────────┬────────────────┘
                             │
                         cacheGet() fallback on error
```

## Theming

- useTheme() provides { colors, mode }
- Settings → switch system / light / dark
- Components pull all colors from the theme (no hardcoded hex)

## Offline Strategy

- UI state: persisted via redux-persist (slice weather)
- Data: the last successful WeatherBundle cached per query keys:
   - geo: units
   - city: city: units
- On fetch error, we return a cached bundle (if it exists) → the app still shows usable data

## Testing

Run tests:
```bash
yarn test
# or watch
yarn test:watch
```
What’s covered:
- UTC-driven aggregation (5-day highs/lows, noon icon, hourly for today)
- RTK Query endpoints, URL building, cacheSet, cache fallback on error
- format utilities
- AsyncStorage set/get, malformed JSON, error tolerance

Tests results:
```txt
PASS __tests__/weather.api.test.ts
PASS __tests__/cache.test.ts
PASS __tests__/transform.test.ts
PASS __tests__/format.test.ts
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |   93.67 |    65.78 |     100 |    98.5 |                   
 services        |    91.8 |    59.37 |     100 |   98.07 |                   
  transform.ts   |     100 |    68.75 |     100 |     100 | 17-35             
  weather.api.ts |   86.84 |       50 |     100 |   96.87 | 37                
 utils           |     100 |      100 |     100 |     100 |                   
  cache.ts       |     100 |      100 |     100 |     100 |                   
  format.ts      |     100 |      100 |     100 |     100 |                   
-----------------|---------|----------|---------|---------|-------------------

Test Suites: 4 passed, 4 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        0.436 s, estimated 1 s
Ran all test suites.
Done in 1.68s
```


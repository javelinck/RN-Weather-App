/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import type { ThemeMode } from '@/src/features/weather/weather.slice';

type ThemeSlice = { weather?: { themeMode?: ThemeMode } };

export function useTheme() {
  const systemDark = useColorScheme() === 'dark';
  const mode = useSelector((s: ThemeSlice) => s.weather?.themeMode ?? 'system');

  const dark = mode === 'system' ? systemDark : mode === 'dark';
  return {
    dark,
    mode,
    colors: {
      bg: dark ? '#0B0F14' : '#F5F9FF',
      card: dark ? '#131C26' : '#FFFFFF',
      text: dark ? '#E8EEF6' : '#0A1A2A',
      sub: dark ? '#A5B5C5' : '#3B4B5B',
      tint: '#4da3ff',
      danger: '#ff6b6b',
    },
  } as const;
}

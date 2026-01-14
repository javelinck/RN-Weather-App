import { createSlice } from '@reduxjs/toolkit';

import type { Units } from './types';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'system' | 'light' | 'dark';
export type UIState = { favorites: string[]; units: Units; themeMode: ThemeMode };

const initialState: UIState = { favorites: [], units: 'metric', themeMode: 'system' };

const norm = (s: string) => s.trim();
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addFavorite(s, action: PayloadAction<string>) {
      const city = norm(action.payload);
      if (!city) return;
      if (!s.favorites.some((c) => same(c, city))) {
        s.favorites.unshift(city);
        if (s.favorites.length > 24) s.favorites.pop();
      }
    },
    removeFavorite(s, action: PayloadAction<string>) {
      const key = norm(action.payload);
      s.favorites = s.favorites.filter((c) => !same(c, key));
    },
    setUnits(s, action: PayloadAction<Units>) {
      s.units = action.payload;
    },
    toggleUnits(s) {
      s.units = s.units === 'metric' ? 'imperial' : 'metric';
    },
    setThemeMode(s, action: PayloadAction<ThemeMode>) {
      s.themeMode = action.payload;
    },
    cycleThemeMode(s) {
      s.themeMode =
        s.themeMode === 'system' ? 'light' : s.themeMode === 'light' ? 'dark' : 'system';
    },
  },
});

export const { addFavorite, removeFavorite, setUnits, toggleUnits, setThemeMode, cycleThemeMode } =
  weatherSlice.actions;
export default weatherSlice.reducer;

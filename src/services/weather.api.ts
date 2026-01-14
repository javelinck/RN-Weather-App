import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';

import { cacheGet, cacheSet } from '../utils/cache';

import { transformWeather } from './transform';

import type { WeatherBundle, Units } from '../features/weather/types';

const API_KEY = Constants.expoConfig?.extra?.OWM_API_KEY as string;
const BASE = Constants.expoConfig?.extra?.API_BASE_URL as string;

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE }),
  tagTypes: ['Geo', 'City'],
  keepUnusedDataFor: 900,
  endpoints: (build) => ({
    getByCoords: build.query<WeatherBundle, { lat: number; lon: number; units: Units }>({
      async queryFn({ lat, lon, units }) {
        const key = `geo:${units}`;
        try {
          const [cur, fc] = await Promise.all([
            fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`),
            fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`),
          ]);
          if (!cur.ok) throw new Error('Current weather failed');
          if (!fc.ok) throw new Error('Forecast failed');
          const currentJson = await cur.json();
          const forecastJson = await fc.json();
          const data = transformWeather(currentJson, forecastJson);
          await cacheSet(key, data);
          return { data };
        } catch (e: any) {
          const cached = await cacheGet<WeatherBundle>(key);
          if (cached) return { data: cached };
          return { error: { status: 'CUSTOM', error: e?.message || 'Fetch error' } as any };
        }
      },
      providesTags: [{ type: 'Geo', id: 'LOCATION' }],
    }),

    getByCity: build.query<WeatherBundle, { city: string; units: Units }>({
      async queryFn({ city, units }) {
        const key = `city:${city.toLowerCase()}:${units}`;
        try {
          const [cur, fc] = await Promise.all([
            fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`),
            fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`),
          ]);
          if (!cur.ok) throw new Error('City not found');
          if (!fc.ok) throw new Error('Forecast failed');
          const currentJson = await cur.json();
          const forecastJson = await fc.json();
          const data = transformWeather(currentJson, forecastJson);
          await cacheSet(key, data);
          return { data };
        } catch (e: any) {
          const cached = await cacheGet<WeatherBundle>(key);
          if (cached) return { data: cached };
          return { error: { status: 'CUSTOM', error: e?.message || 'Fetch error' } as any };
        }
      },
      providesTags: (res, err, { city }) => [{ type: 'City', id: city.toLowerCase() }],
    }),
  }),
});

export const { useGetByCoordsQuery, useLazyGetByCityQuery } = weatherApi;

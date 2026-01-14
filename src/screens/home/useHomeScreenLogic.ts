import { skipToken } from '@reduxjs/toolkit/query';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { removeFavorite } from '@/src/features/weather/weather.slice';

import { useGetByCoordsQuery, useLazyGetByCityQuery } from '../../services/weather.api';

import type { RootState } from '@/src/store/store';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function getErrorMessage(err: unknown): string | null {
  if (!err) return null;
  if (typeof (err as { error?: unknown }).error === 'string') {
    return (err as { error?: string }).error!;
  }

  const fe = err as FetchBaseQueryError;
  if (fe && typeof fe === 'object' && 'status' in fe) {
    const anyFe = fe as FetchBaseQueryError & { data?: unknown };
    if (anyFe.data) return typeof anyFe.data === 'string' ? anyFe.data : JSON.stringify(anyFe.data);
    return String(anyFe.status);
  }
  const se = err as SerializedError;
  if (se?.message) return se.message;
  return null;
}

export const useHomeScreenLogic = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((s: RootState) => s.weather.favorites);
  const units = useSelector((s: RootState) => s.weather.units);

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      }
    })();
  }, []);

  const {
    data: geoData,
    error: geoError,
    isFetching: geoLoading,
    refetch,
  } = useGetByCoordsQuery(coords ? { lat: coords.lat, lon: coords.lon, units } : skipToken);

  const [triggerCity, cityRes] = useLazyGetByCityQuery();

  const onSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      triggerCity({ city: q.trim(), units });
    },
    [triggerCity, units],
  );

  useEffect(() => {
    const last = cityRes.originalArgs?.city;
    if (last) triggerCity({ city: last, units });
  }, [cityRes.originalArgs?.city, triggerCity, units]);

  const onRefresh = useCallback(() => {
    if (coords) refetch();
  }, [coords, refetch]);

  const data = cityRes.data ?? geoData;
  const loading = cityRes.isFetching || geoLoading;
  const errMsg = getErrorMessage(cityRes.error) ?? getErrorMessage(geoError);

  const handleRemoveFavorite = (city: string) => dispatch(removeFavorite(city));
  const handleTriggerCity = (city: string) => triggerCity({ city, units });

  return {
    data,
    loading,
    errMsg,
    favorites,
    dispatch,
    onSearch,
    onRefresh,
    handleRemoveFavorite,
    handleTriggerCity,
  };
};

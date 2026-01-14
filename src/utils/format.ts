import type { Units } from '../features/weather/types';

export const formatTemp = (t: number, u: Units) => `${t}°${u === 'metric' ? 'C' : 'F'}`;
export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
export const formatHour = (ts: number) =>
  new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
export const formatWind = (v: number, u: Units) => `${v} ${u === 'metric' ? 'm/s' : 'mph'}`;

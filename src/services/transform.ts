import type {
  DailyEntry,
  HourlyEntry,
  OWCurrent,
  OWForecast,
  OWForecastItem,
  WeatherBundle,
} from '../features/weather/types';

/** Aggregate 3h forecast buckets → daily highs/lows, plus today's hourly list. */
export function transformWeather(current: OWCurrent, forecast: OWForecast): WeatherBundle {
  const curWeather = current.weather?.[0];

  const currentBundle = {
    name: current.name,
    temp: Math.round(current.main.temp),
    condition: curWeather?.main ?? '',
    description: curWeather?.description ?? '',
    icon: curWeather?.icon ?? '01d',
    humidity: current.main.humidity,
    wind: current.wind.speed,
    dt: current.dt * 1000,
  };

  const list: OWForecastItem[] = Array.isArray(forecast?.list) ? forecast.list : [];
  const byDay: Record<string, { high: number; low: number; icon: string }> = {};
  const todayStr = new Date().toISOString().slice(0, 10);
  const hourly: HourlyEntry[] = [];

  for (const it of list) {
    const dtMs = it.dt * 1000;
    const dt = new Date(dtMs);
    const dayIso = dt.toISOString().slice(0, 10);
    const temp = Math.round(it.main.temp);
    const icon = it.weather?.[0]?.icon ?? '01d';

    if (!byDay[dayIso]) byDay[dayIso] = { high: temp, low: temp, icon };
    byDay[dayIso].high = Math.max(byDay[dayIso].high, temp);
    byDay[dayIso].low = Math.min(byDay[dayIso].low, temp);

    if (dt.getUTCHours() === 12) byDay[dayIso].icon = icon;

    if (dayIso === todayStr) hourly.push({ dt: dtMs, temp, icon });
  }

  const daily: DailyEntry[] = Object.keys(byDay)
    .sort()
    .slice(0, 5)
    .map((date) => ({
      date,
      high: byDay[date].high,
      low: byDay[date].low,
      icon: byDay[date].icon,
    }));

  return { current: currentBundle, hourly, daily };
}

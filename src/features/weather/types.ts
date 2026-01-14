export type Units = 'metric' | 'imperial';

export type CurrentWeather = {
  name: string;
  temp: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
  dt: number;
};

export type HourlyEntry = { dt: number; temp: number; icon: string };
export type DailyEntry = { date: string; high: number; low: number; icon: string };

export type WeatherBundle = { current: CurrentWeather; hourly: HourlyEntry[]; daily: DailyEntry[] };

export type OWWeather = {
  main?: string;
  description?: string;
  icon?: string;
};

export type OWCurrent = {
  name: string;
  dt: number;
  main: { temp: number; humidity: number };
  wind: { speed: number };
  weather: OWWeather[];
};

export type OWForecastItem = {
  dt: number;
  main: { temp: number };
  weather: OWWeather[];
};

export type OWForecast = {
  list: OWForecastItem[];
};

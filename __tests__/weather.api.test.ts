import { configureStore } from '@reduxjs/toolkit';

import { weatherApi } from '@/src/services/weather.api';
import { cacheGet, cacheSet } from '@/src/utils/cache';

jest.mock('../src/utils/cache', () => ({
  cacheGet: jest.fn(async () => null),
  cacheSet: jest.fn(async () => {}),
}));

jest.mock('../src/services/transform', () => ({
  transformWeather: jest.fn((cur) => ({
    current: {
      name: cur?.name ?? 'N/A',
      temp: Math.round(cur?.main?.temp ?? 0),
      condition: cur?.weather?.[0]?.main ?? '',
      description: cur?.weather?.[0]?.description ?? '',
      icon: cur?.weather?.[0]?.icon ?? '01d',
      humidity: cur?.main?.humidity ?? 0,
      wind: cur?.wind?.speed ?? 0,
      dt: (cur?.dt ?? 0) * 1000,
    },
    hourly: [],
    daily: [],
  })),
}));

function makeStore() {
  return configureStore({
    reducer: { [weatherApi.reducerPath]: weatherApi.reducer },
    middleware: (gDM) => gDM().concat(weatherApi.middleware),
  });
}

const currentJson = {
  name: 'Rome',
  dt: 1700000000,
  main: { temp: 12, humidity: 70 },
  wind: { speed: 4 },
  weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
};
const forecastJson = {
  list: [
    { dt: 1700000000, main: { temp: 12 }, weather: [{ icon: '02d' }] },
    { dt: 1700000000 + 12 * 3600, main: { temp: 16 }, weather: [{ icon: '01d' }] },
  ],
};

let fetchMock: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  fetchMock = jest.fn();
  global.fetch = fetchMock;
});

describe('weatherApi endpoints', () => {
  it('getByCity: success → 2 fetch calls, correct URLs, cacheSet called', async () => {
    const store = makeStore();

    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => currentJson })
      .mockResolvedValueOnce({ ok: true, json: async () => forecastJson });

    const res = await store.dispatch(
      weatherApi.endpoints.getByCity.initiate({ city: 'Rome', units: 'metric' }),
    );
    (res as any).unsubscribe?.();

    expect(res).toHaveProperty('data');
    expect((res as any).data.current.name).toBe('Rome');

    // Перевіряємо URL-и незалежно від порядку query params
    const cityUrl1 = new URL(fetchMock.mock.calls[0][0] as string);
    expect(cityUrl1.pathname.endsWith('/weather')).toBe(true);
    expect(cityUrl1.searchParams.get('q')).toBe('Rome');
    expect(cityUrl1.searchParams.get('units')).toBe('metric');
    expect(cityUrl1.searchParams.get('appid')).toBe('test-key');

    const cityUrl2 = new URL(fetchMock.mock.calls[1][0] as string);
    expect(cityUrl2.pathname.endsWith('/forecast')).toBe(true);
    expect(cityUrl2.searchParams.get('q')).toBe('Rome');
    expect(cityUrl2.searchParams.get('units')).toBe('metric');
    expect(cityUrl2.searchParams.get('appid')).toBe('test-key');

    expect(cacheSet).toHaveBeenCalledWith('city:rome:metric', expect.any(Object));
  });

  it('getByCity: network error → returns cache when present', async () => {
    const store = makeStore();
    fetchMock.mockRejectedValueOnce(new Error('network down'));

    const cachedBundle = {
      current: {
        name: 'Rome',
        temp: 10,
        condition: 'Clear',
        description: 'clear sky',
        icon: '01d',
        humidity: 50,
        wind: 2,
        dt: 1700000000 * 1000,
      },
      hourly: [],
      daily: [],
    };
    (cacheGet as jest.Mock).mockResolvedValueOnce(cachedBundle);

    const res = await store.dispatch(
      weatherApi.endpoints.getByCity.initiate({ city: 'Rome', units: 'metric' }),
    );
    (res as any).unsubscribe?.();

    expect((res as any).data.current.name).toBe('Rome');
  });

  it('getByCity: network error and no cache → returns error', async () => {
    const store = makeStore();
    fetchMock.mockRejectedValueOnce(new Error('boom'));

    (cacheGet as jest.Mock).mockResolvedValueOnce(null);

    const res = await store.dispatch(
      weatherApi.endpoints.getByCity.initiate({ city: 'Nope', units: 'metric' }),
    );
    (res as any).unsubscribe?.();

    expect(res).toHaveProperty('error');
    expect((res as any).error).toEqual(
      expect.objectContaining({ status: 'CUSTOM', error: expect.any(String) }),
    );
  });

  it('getByCoords: success → 2 fetch calls with lat/lon, cacheSet called', async () => {
    const store = makeStore();

    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => currentJson })
      .mockResolvedValueOnce({ ok: true, json: async () => forecastJson });

    const res = await store.dispatch(
      weatherApi.endpoints.getByCoords.initiate({ lat: 41.9, lon: 12.5, units: 'imperial' }),
    );
    (res as any).unsubscribe?.();

    expect(res).toHaveProperty('data');

    const geoUrl1 = new URL(fetchMock.mock.calls[0][0] as string);
    expect(geoUrl1.pathname.endsWith('/weather')).toBe(true);
    expect(geoUrl1.searchParams.get('lat')).toBe('41.9');
    expect(geoUrl1.searchParams.get('lon')).toBe('12.5');
    expect(geoUrl1.searchParams.get('units')).toBe('imperial');
    expect(geoUrl1.searchParams.get('appid')).toBe('test-key');

    const geoUrl2 = new URL(fetchMock.mock.calls[1][0] as string);
    expect(geoUrl2.pathname.endsWith('/forecast')).toBe(true);
    expect(geoUrl2.searchParams.get('lat')).toBe('41.9');
    expect(geoUrl2.searchParams.get('lon')).toBe('12.5');
    expect(geoUrl2.searchParams.get('units')).toBe('imperial');
    expect(geoUrl2.searchParams.get('appid')).toBe('test-key');

    expect(cacheSet).toHaveBeenCalledWith('geo:imperial', expect.any(Object));
  });

  it('getByCoords: network error → cache fallback', async () => {
    const store = makeStore();
    fetchMock.mockRejectedValueOnce(new Error('offline'));

    const cached = {
      current: {
        name: 'Geo',
        temp: 1,
        condition: '',
        description: '',
        icon: '01d',
        humidity: 0,
        wind: 0,
        dt: 0,
      },
      hourly: [],
      daily: [],
    };
    (cacheGet as jest.Mock).mockResolvedValueOnce(cached);

    const res = await store.dispatch(
      weatherApi.endpoints.getByCoords.initiate({ lat: 1, lon: 2, units: 'metric' }),
    );
    (res as any).unsubscribe?.();

    expect((res as any).data?.current?.name).toBe('Geo');
  });
});

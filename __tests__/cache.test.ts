import { cacheSet, cacheGet } from '@/src/utils/cache';

const AsyncStorage = jest.requireMock('@react-native-async-storage/async-storage');

describe('utils/cache', () => {
  const PREFIX = 'weather-cache:';
  const key = 'city:rome:metric';

  beforeEach(() => {
    jest.clearAllMocks();
    if (typeof AsyncStorage.clear === 'function') {
      AsyncStorage.clear();
    }
  });

  it('cacheSet writes JSON with value and ts, prefixed key', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1711111111111);
    const setSpy = jest.spyOn(AsyncStorage, 'setItem');

    const value = { foo: 'bar', n: 42 };
    await cacheSet(key, value);

    expect(setSpy).toHaveBeenCalledTimes(1);
    const [storedKey, payloadStr] = setSpy.mock.calls[0];

    expect(storedKey).toBe(PREFIX + key);

    const payload = JSON.parse(String(payloadStr));
    expect(payload).toEqual(
      expect.objectContaining({
        value,
        ts: 1711111111111,
      }),
    );

    nowSpy.mockRestore();
  });

  it('cacheGet returns parsed value for existing entry (round-trip)', async () => {
    const obj = { a: 1, b: 'x' };
    await cacheSet(key, obj);

    const result = await cacheGet<typeof obj>(key);
    expect(result).toEqual(obj);
  });

  it('cacheGet returns null when key is missing', async () => {
    const result = await cacheGet<any>('missing:key');
    expect(result).toBeNull();
  });

  it('cacheGet returns null on malformed JSON', async () => {
    const getSpy = jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('not-json');
    const result = await cacheGet<any>(key);
    expect(getSpy).toHaveBeenCalledWith(PREFIX + key);
    expect(result).toBeNull();
  });

  it('cacheSet swallows setItem errors and warns once', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const setSpy = jest
      .spyOn(AsyncStorage, 'setItem')
      .mockRejectedValueOnce(new Error('disk full'));

    await expect(cacheSet(key, { ok: true })).resolves.toBeUndefined();

    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('Failed to cache value');

    warnSpy.mockRestore();
  });
});

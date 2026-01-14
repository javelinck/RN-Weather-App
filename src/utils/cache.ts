import AsyncStorage from '@react-native-async-storage/async-storage';
const PREFIX = 'weather-cache:';

export async function cacheSet(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify({ value, ts: Date.now() }));
  } catch {
    console.warn('Failed to cache value');
  }
}
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw).value as T;
  } catch {
    return null;
  }
}

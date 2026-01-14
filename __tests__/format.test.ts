import { formatTemp, formatDay, formatHour, formatWind } from '@/src/utils/format';

import type { Units } from '@/src/features/weather/types';

describe('utils/format', () => {
  describe('formatTemp', () => {
    it('formats Celsius for metric', () => {
      expect(formatTemp(12, 'metric' as Units)).toBe('12°C');
    });

    it('formats Fahrenheit for imperial', () => {
      expect(formatTemp(68, 'imperial' as Units)).toBe('68°F');
    });
  });

  describe('formatWind', () => {
    it('uses m/s for metric', () => {
      expect(formatWind(5, 'metric' as Units)).toBe('5 m/s');
    });

    it('uses mph for imperial', () => {
      expect(formatWind(10, 'imperial' as Units)).toBe('10 mph');
    });
  });

  describe('formatDay', () => {
    const iso = '2025-01-15T00:00:00.000Z';

    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest
        .spyOn(Date.prototype, 'toLocaleDateString')
        .mockImplementation(function (_locales, _options) {
          return 'Wed, Jan 15';
        });
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('calls toLocaleDateString with weekday+month+day and returns its result', () => {
      const result = formatDay(iso);
      expect(result).toBe('Wed, Jan 15');

      expect(spy).toHaveBeenCalledWith(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    });
  });

  describe('formatHour', () => {
    const ts = Date.UTC(2025, 0, 15, 13, 45, 0, 0);

    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest
        .spyOn(Date.prototype, 'toLocaleTimeString')
        .mockImplementation(function (_locales, _options) {
          return '13:45';
        });
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('calls toLocaleTimeString with hour+minute and returns its result', () => {
      const result = formatHour(ts);
      expect(result).toBe('13:45');

      expect(spy).toHaveBeenCalledWith(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
    });
  });
});

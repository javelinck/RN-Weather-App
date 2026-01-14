import { transformWeather } from '../src/services/transform';

function utcTsAt(hoursFromMidnight: number, dayOffset = 0): number {
  const base = new Date();
  base.setUTCHours(0, 0, 0, 0);
  const ms = base.getTime() + dayOffset * 24 * 3600_000 + hoursFromMidnight * 3600_000;
  return Math.floor(ms / 1000);
}

function slot(hours: number, temp: number, icon = '01d', dayOffset = 0) {
  return {
    dt: utcTsAt(hours, dayOffset),
    main: { temp },
    weather: [{ icon }],
  };
}

describe('transformWeather (UTC-based)', () => {
  it('builds current, today hourly, and 5-day daily with noon icon', () => {
    const current = {
      name: 'Rome',
      dt: utcTsAt(6),
      main: { temp: 12.6, humidity: 70 },
      wind: { speed: 3.4 },
      weather: [{ main: 'Clouds', description: 'broken clouds', icon: '04d' }],
    };

    const todaySlots = [
      slot(0, 10, '04d'),
      slot(3, 11, '04d'),
      slot(6, 12, '04d'),
      slot(9, 13, '04d'),
      slot(12, 15, '01d'),
      slot(15, 14, '04d'),
      slot(18, 12, '04d'),
      slot(21, 11, '04d'),
    ];

    const tomorrowSlots = [slot(0, 9, '10d', 1), slot(12, 14, '10d', 1), slot(21, 8, '10d', 1)];

    const forecast = { list: [...todaySlots, ...tomorrowSlots] };

    const res = transformWeather(current, forecast);

    expect(res.current.name).toBe('Rome');
    expect(res.current.temp).toBe(13);
    expect(res.current.humidity).toBe(70);
    expect(res.current.wind).toBe(3.4);
    expect(typeof res.current.dt).toBe('number');

    expect(res.hourly.length).toBe(8);
    const hasNoonInHourly = res.hourly.some((h) => {
      const d = new Date(h.dt);
      return d.getUTCHours() === 12 && h.icon === '01d' && h.temp === 15;
    });

    expect(hasNoonInHourly).toBe(true);
    expect(res.daily.length).toBeGreaterThanOrEqual(2);

    const day0 = res.daily[0];
    expect(day0.high).toBe(15);
    expect(day0.low).toBe(10);

    const day1 = res.daily[1];
    expect(day1.high).toBe(14);
    expect(day1.low).toBe(8);
    expect(day1.icon).toBe('10d');
  });
});

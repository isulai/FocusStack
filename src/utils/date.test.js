import { describe, expect, it } from 'vitest';
import { getDateKeyFromTimestamp, getRelativeLocalDateKey, getToday, getYesterday } from './date';

describe('date helpers', () => {
  it('uses the local calendar date instead of the UTC date', () => {
    expect(getDateKeyFromTimestamp('2026-04-15T00:30:00+05:30')).toBe('2026-04-15');
  });

  it('derives today and yesterday from the local calendar', () => {
    const now = new Date('2026-04-15T09:00:00+05:30');

    expect(getToday(now)).toBe('2026-04-15');
    expect(getYesterday(now)).toBe('2026-04-14');
  });

  it('walks relative day keys without switching to UTC buckets', () => {
    expect(getRelativeLocalDateKey(-6, new Date('2026-04-15T09:00:00+05:30'))).toBe('2026-04-09');
  });
});

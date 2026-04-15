import { describe, expect, it } from 'vitest';
import { buildLast7Days } from './StatsView';

describe('buildLast7Days', () => {
  it('matches history entries using local day buckets', () => {
    const history = [
      { date: '2026-04-14', tasksCompleted: 3, tasksTotal: 4, categories: {} },
      { date: '2026-04-15', tasksCompleted: 2, tasksTotal: 2, categories: {} },
    ];

    const result = buildLast7Days(history, new Date('2026-04-15T09:00:00+05:30'));

    expect(result).toHaveLength(7);
    expect(result[5]).toMatchObject({ date: '2026-04-14', count: 3, isToday: false });
    expect(result[6]).toMatchObject({ date: '2026-04-15', count: 2, isToday: true });
  });
});

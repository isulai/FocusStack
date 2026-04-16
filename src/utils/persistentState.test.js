import { describe, expect, it } from 'vitest';
import { createPersistedState, normalizePersistedState } from './persistentState';

describe('normalizePersistedState', () => {
  it('returns null for invalid payloads', () => {
    expect(normalizePersistedState(null)).toBeNull();
    expect(normalizePersistedState({})).toBeNull();
  });

  it('normalizes missing fields to safe defaults', () => {
    const normalized = normalizePersistedState({
      version: 1,
      savedAt: '2026-04-16T10:00:00.000Z',
      data: {
        tasks: [{ id: '1' }],
        streak: 'bad',
        longestStreak: 3,
        lastActiveDate: '',
      },
    });

    expect(normalized.data.tasks).toEqual([{ id: '1' }]);
    expect(normalized.data.history).toEqual([]);
    expect(normalized.data.streak).toBe(0);
    expect(normalized.data.longestStreak).toBe(3);
    expect(normalized.data.lastActiveDate).toBeNull();
  });
});

describe('createPersistedState', () => {
  it('creates a disk-friendly payload from provided state', () => {
    const payload = createPersistedState({
      tasks: [{ id: 'task-1' }],
      history: [{ date: '2026-04-15' }],
      streak: 2,
      longestStreak: 4,
      lastActiveDate: '2026-04-16',
      lastReset: '2026-04-16',
    });

    expect(payload.version).toBe(1);
    expect(payload.data.tasks).toHaveLength(1);
    expect(payload.data.history).toHaveLength(1);
    expect(payload.data.streak).toBe(2);
    expect(payload.data.longestStreak).toBe(4);
    expect(payload.data.lastActiveDate).toBe('2026-04-16');
    expect(payload.data.lastReset).toBe('2026-04-16');
  });
});

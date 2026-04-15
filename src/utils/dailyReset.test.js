import { describe, expect, it } from 'vitest';
import { partitionTasksByDay } from './dailyReset';

describe('partitionTasksByDay', () => {
  it('keeps only today tasks in active storage and groups older ones for archival', () => {
    const tasks = [
      { id: 'old-1', text: 'Yesterday task', createdAt: '2026-04-14T23:30:00+05:30' },
      { id: 'old-2', text: 'Two days ago', createdAt: '2026-04-13T08:00:00+05:30' },
      { id: 'today-1', text: 'Today task', createdAt: '2026-04-15T08:15:00+05:30' },
    ];

    const result = partitionTasksByDay(tasks, '2026-04-15');

    expect(result.currentTasks.map((task) => task.id)).toEqual(['today-1']);
    expect(result.archivedTaskGroups).toHaveLength(2);
    expect(result.archivedTaskGroups.map((group) => group[0].id)).toEqual(['old-1', 'old-2']);
  });

  it('moves late-night tasks into the previous-day archive bucket', () => {
    const tasks = [
      { id: 'late-night', text: 'Late night task', createdAt: '2026-04-14T23:50:00+05:30' },
    ];

    const result = partitionTasksByDay(tasks, '2026-04-15');

    expect(result.currentTasks).toHaveLength(0);
    expect(result.archivedTaskGroups).toHaveLength(1);
    expect(result.archivedTaskGroups[0][0].id).toBe('late-night');
  });
});

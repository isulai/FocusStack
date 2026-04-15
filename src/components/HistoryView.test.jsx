import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import HistoryView from './HistoryView';

describe('HistoryView', () => {
  it('renders completed tasks with a strikethrough and incomplete tasks without one', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T09:00:00+05:30'));

    const html = renderToStaticMarkup(
      <HistoryView
        history={[
          {
            date: '2026-04-14',
            tasksTotal: 2,
            tasksCompleted: 1,
            categories: { Work: 1 },
            tasks: [
              { id: 'done', text: 'Done task', completed: true },
              { id: 'todo', text: 'Not done task', completed: false },
            ],
          },
        ]}
      />,
    );

    expect(html).toContain('Done task');
    expect(html).toContain('text-zinc-400 line-through');
    expect(html).toContain('Not done task');
    expect(html).toContain('text-zinc-600');
    expect(html).not.toContain('text-zinc-600 line-through');

    vi.useRealTimers();
  });
});

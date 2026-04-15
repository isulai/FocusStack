import { useState, useCallback, useEffect } from 'react';
import { loadHistory, saveHistory } from '../utils/storage';
import { getDateKeyFromTimestamp, getToday } from '../utils/date';

export function useHistory() {
  const [history, setHistory] = useState(() => loadHistory());

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addSnapshot = useCallback((tasks) => {
    // Only skip if there are truly no tasks at all.
    // Days with tasks but zero completions should still appear in history
    // so you can see that you had a low-output day (not just a blank entry).
    if (tasks.length === 0) return;
    const completed = tasks.filter((t) => t.completed);

    const categories = {};
    completed.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + 1;
    });

    const snapshot = {
      date: getDateKeyFromTimestamp(tasks[0]?.createdAt, getToday()),
      tasksTotal: tasks.length,
      tasksCompleted: completed.length,
      categories,
      tasks: tasks.map((t) => ({
        id: t.id,
        text: t.text,
        category: t.category,
        completed: t.completed,
        completedAt: t.completedAt,
      })),
    };

    setHistory((prev) => {
      // Replace if same date exists, otherwise prepend
      const existing = prev.findIndex((s) => s.date === snapshot.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = snapshot;
        return updated;
      }
      return [snapshot, ...prev];
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, setHistory, addSnapshot, clearHistory };
}

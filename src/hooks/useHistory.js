import { useState, useCallback, useEffect } from 'react';
import { loadHistory, saveHistory } from '../utils/storage';

export function useHistory() {
  const [history, setHistory] = useState(() => loadHistory());

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addSnapshot = useCallback((tasks) => {
    const completed = tasks.filter((t) => t.completed);
    if (completed.length === 0 && tasks.length === 0) return;

    const categories = {};
    completed.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + 1;
    });

    const snapshot = {
      date: tasks[0]?.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
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

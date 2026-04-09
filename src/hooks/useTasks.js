import { useState, useCallback, useEffect, useRef } from 'react';
import { loadTasks, saveTasks, getToday } from '../utils/storage';

export function useTasks() {
  const isFirstRender = useRef(true);

  const [tasks, setTasks] = useState(() => {
    const stored = loadTasks();
    const today = getToday();
    // Filter to only today's tasks
    return stored.filter((t) => t.createdAt.startsWith(today));
  });

  useEffect(() => {
    // Skip saving on the initial mount — App.jsx needs to archive yesterday's
    // tasks from localStorage before we overwrite it with today's filtered list.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((text, category) => {
    const task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : null,
            }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const hasCompletedToday = completedCount > 0;

  return {
    tasks,
    setTasks,
    addTask,
    toggleTask,
    deleteTask,
    completedCount,
    totalCount,
    hasCompletedToday,
  };
}

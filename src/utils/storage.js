const KEYS = {
  TASKS: 'focusstack_tasks',
  HISTORY: 'focusstack_history',
  STREAK: 'focusstack_streak',
  LONGEST_STREAK: 'focusstack_longest_streak',
  LAST_ACTIVE_DATE: 'focusstack_last_active_date',
};

export function loadState(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadTasks() {
  return loadState(KEYS.TASKS) || [];
}

export function saveTasks(tasks) {
  saveState(KEYS.TASKS, tasks);
}

export function loadHistory() {
  return loadState(KEYS.HISTORY) || [];
}

export function saveHistory(history) {
  saveState(KEYS.HISTORY, history);
}

export function loadStreak() {
  return loadState(KEYS.STREAK) || 0;
}

export function saveStreak(streak) {
  saveState(KEYS.STREAK, streak);
}

export function loadLongestStreak() {
  return loadState(KEYS.LONGEST_STREAK) || 0;
}

export function saveLongestStreak(streak) {
  saveState(KEYS.LONGEST_STREAK, streak);
}

export function loadLastActiveDate() {
  return loadState(KEYS.LAST_ACTIVE_DATE) || null;
}

export function saveLastActiveDate(date) {
  saveState(KEYS.LAST_ACTIVE_DATE, date);
}

export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export { KEYS };

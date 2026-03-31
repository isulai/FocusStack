import { STORAGE_KEYS } from './constants';

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
  return loadState(STORAGE_KEYS.TASKS) || [];
}

export function saveTasks(tasks) {
  saveState(STORAGE_KEYS.TASKS, tasks);
}

export function loadHistory() {
  return loadState(STORAGE_KEYS.HISTORY) || [];
}

export function saveHistory(history) {
  saveState(STORAGE_KEYS.HISTORY, history);
}

export function loadStreak() {
  return loadState(STORAGE_KEYS.STREAK) || 0;
}

export function saveStreak(streak) {
  saveState(STORAGE_KEYS.STREAK, streak);
}

export function loadLongestStreak() {
  return loadState(STORAGE_KEYS.LONGEST_STREAK) || 0;
}

export function saveLongestStreak(streak) {
  saveState(STORAGE_KEYS.LONGEST_STREAK, streak);
}

export function loadLastActiveDate() {
  return loadState(STORAGE_KEYS.LAST_ACTIVE_DATE) || null;
}

export function saveLastActiveDate(date) {
  saveState(STORAGE_KEYS.LAST_ACTIVE_DATE, date);
}

export function getToday() {
  return new Date().toISOString().split('T')[0];
}

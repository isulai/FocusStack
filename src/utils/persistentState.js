import {
  loadHistory,
  loadLastActiveDate,
  loadLongestStreak,
  loadStreak,
  loadTasks,
  saveHistory,
  saveLastActiveDate,
  saveLongestStreak,
  saveStreak,
  saveTasks,
} from './storage';
import { STORAGE_KEYS } from './constants';

export const PERSISTED_STATE_PATH = '/api/focusstack-state';
const PERSISTED_STATE_VERSION = 1;

function normalizeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function normalizeString(value) {
  return typeof value === 'string' && value.trim() ? value : null;
}

export function normalizePersistedState(snapshot) {
  if (!snapshot || typeof snapshot !== 'object' || !snapshot.data || typeof snapshot.data !== 'object') {
    return null;
  }

  return {
    version: typeof snapshot.version === 'number' ? snapshot.version : PERSISTED_STATE_VERSION,
    savedAt: normalizeString(snapshot.savedAt),
    data: {
      tasks: Array.isArray(snapshot.data.tasks) ? snapshot.data.tasks : [],
      history: Array.isArray(snapshot.data.history) ? snapshot.data.history : [],
      streak: normalizeNumber(snapshot.data.streak),
      longestStreak: normalizeNumber(snapshot.data.longestStreak),
      lastActiveDate: normalizeString(snapshot.data.lastActiveDate),
      lastReset: normalizeString(snapshot.data.lastReset),
    },
  };
}

export function createPersistedState({
  tasks = loadTasks(),
  history = loadHistory(),
  streak = loadStreak(),
  longestStreak = loadLongestStreak(),
  lastActiveDate = loadLastActiveDate(),
  lastReset = localStorage.getItem('focusstack_last_reset'),
} = {}) {
  return {
    version: PERSISTED_STATE_VERSION,
    savedAt: new Date().toISOString(),
    data: {
      tasks,
      history,
      streak,
      longestStreak,
      lastActiveDate,
      lastReset,
    },
  };
}

export function applyPersistedState(snapshot) {
  const normalized = normalizePersistedState(snapshot);

  if (!normalized) {
    return false;
  }

  const {
    tasks,
    history,
    streak,
    longestStreak,
    lastActiveDate,
    lastReset,
  } = normalized.data;

  saveTasks(tasks);
  saveHistory(history);
  saveStreak(streak);
  saveLongestStreak(longestStreak);

  if (lastActiveDate) {
    saveLastActiveDate(lastActiveDate);
  } else {
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
  }

  if (lastReset) {
    localStorage.setItem('focusstack_last_reset', lastReset);
  } else {
    localStorage.removeItem('focusstack_last_reset');
  }

  return true;
}

export async function bootstrapPersistedState() {
  try {
    const response = await fetch(PERSISTED_STATE_PATH, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 404 || response.status === 204) {
      return false;
    }

    if (!response.ok) {
      return false;
    }

    const snapshot = await response.json();
    return applyPersistedState(snapshot);
  } catch {
    return false;
  }
}

export async function syncPersistedState(snapshot = createPersistedState()) {
  const normalized = normalizePersistedState(snapshot);

  if (!normalized) {
    return false;
  }

  try {
    const response = await fetch(PERSISTED_STATE_PATH, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalized),
    });

    return response.ok;
  } catch {
    return false;
  }
}

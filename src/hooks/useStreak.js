import { useState, useCallback, useEffect } from 'react';
import {
  loadStreak,
  saveStreak,
  loadLongestStreak,
  saveLongestStreak,
  loadLastActiveDate,
  saveLastActiveDate,
} from '../utils/storage';
import { getToday, getYesterday } from '../utils/date';

export function useStreak() {
  const [streak, setStreak] = useState(() => {
    const stored = loadStreak();
    const lastActive = loadLastActiveDate();
    const today = getToday();
    const yesterday = getYesterday();

    // If last active was before yesterday, streak is broken
    if (lastActive && lastActive !== today && lastActive !== yesterday) {
      saveStreak(0);
      return 0;
    }
    return stored;
  });

  const [longestStreak, setLongestStreak] = useState(() => loadLongestStreak());

  useEffect(() => {
    saveStreak(streak);
  }, [streak]);

  useEffect(() => {
    saveLongestStreak(longestStreak);
  }, [longestStreak]);

  const recordDay = useCallback(() => {
    const today = getToday();
    const lastActive = loadLastActiveDate();

    if (lastActive === today) return; // Already recorded today

    const yesterday = getYesterday();
    const newStreak = lastActive === yesterday ? streak + 1 : 1;

    setStreak(newStreak);
    saveLastActiveDate(today);

    if (newStreak > longestStreak) {
      setLongestStreak(newStreak);
    }
  }, [streak, longestStreak]);

  return { streak, longestStreak, recordDay, setStreak, setLongestStreak };
}

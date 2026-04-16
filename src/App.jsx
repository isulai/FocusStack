import { useState, useEffect, useRef } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import StreakTracker from './components/StreakTracker';
import HistoryView from './components/HistoryView';
import StatsView from './components/StatsView';
import { useTasks } from './hooks/useTasks';
import { useHistory } from './hooks/useHistory';
import { useStreak } from './hooks/useStreak';
import { exportData } from './utils/json';
import { STORAGE_KEYS } from './utils/constants';
import { getDateKeyFromTimestamp, getToday } from './utils/date';
import { partitionTasksByDay } from './utils/dailyReset';
import { createPersistedState, syncPersistedState } from './utils/persistentState';
import {
  loadLastActiveDate,
  saveTasks,
  saveHistory,
  saveStreak,
  saveLongestStreak,
  saveLastActiveDate,
} from './utils/storage';

const TABS = ['Today', 'History', 'Stats'];

export default function App() {
  const [activeTab, setActiveTab] = useState('Today');
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const importRef = useRef(null);

  const { tasks, setTasks, addTask, toggleTask, deleteTask, completedCount, totalCount, hasCompletedToday } = useTasks();
  const { history, setHistory, addSnapshot } = useHistory();
  const { streak, longestStreak, recordDay, setStreak, setLongestStreak } = useStreak();

  // Record streak when a task is completed
  useEffect(() => {
    if (hasCompletedToday) {
      recordDay();
    }
  }, [hasCompletedToday]);

  // Daily reset: archive old tasks once per calendar day
  useEffect(() => {
    const checkReset = () => {
      const today = getToday();
      // Guard: only run the archival once per day so we never double-archive
      const lastReset = localStorage.getItem('focusstack_last_reset');
      if (lastReset === today) return;

      const storedRaw = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!storedRaw) {
        localStorage.setItem('focusstack_last_reset', today);
        return;
      }
      try {
        const stored = JSON.parse(storedRaw);
        const { currentTasks, archivedTaskGroups } = partitionTasksByDay(stored, today);
        archivedTaskGroups.forEach((dayTasks) => addSnapshot(dayTasks));
        saveTasks(currentTasks);
        setTasks(currentTasks);
        localStorage.setItem('focusstack_last_reset', today);
      } catch { /* ignore parse errors */ }
    };
    checkReset();
  }, []);

  // Live snapshot: keep today's history entry up-to-date whenever tasks change.
  // This is what makes Stats show today's progress in real time instead of only
  // showing it from tomorrow onwards.
  useEffect(() => {
    if (tasks.length > 0) {
      addSnapshot(tasks);
    }
  }, [tasks]);

  // Mirror the current app state to a JSON file on disk when the local
  // Vite API is available. This protects data across browser storage resets.
  useEffect(() => {
    const snapshot = createPersistedState({
      tasks,
      history,
      streak,
      longestStreak,
      lastActiveDate: loadLastActiveDate(),
      lastReset: localStorage.getItem('focusstack_last_reset'),
    });

    void syncPersistedState(snapshot);
  }, [tasks, history, streak, longestStreak]);

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.version || !Array.isArray(data.tasks) || !Array.isArray(data.history)) {
          setImportError('Invalid FocusStack backup file.');
          return;
        }
        // Apply imported data
        const today = getToday();
        const todayTasks = data.tasks.filter((t) => getDateKeyFromTimestamp(t.createdAt, today) === today);
        setTasks(todayTasks);
        saveTasks(todayTasks);
        setHistory(data.history);
        saveHistory(data.history);
        if (typeof data.streak === 'number') {
          setStreak(data.streak);
          saveStreak(data.streak);
        }
        if (typeof data.longestStreak === 'number') {
          setLongestStreak(data.longestStreak);
          saveLongestStreak(data.longestStreak);
        }
        if (data.lastActiveDate) {
          saveLastActiveDate(data.lastActiveDate);
        }
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch {
        setImportError('Failed to parse file. Make sure it is a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    // Reset so same file can be re-imported
    e.target.value = '';
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Header */}
        <header className="py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">FocusStack</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Import */}
            <button
              onClick={() => importRef.current?.click()}
              id="import-btn"
              title="Import JSON backup"
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

            {/* Export */}
            <button
              onClick={exportData}
              id="export-btn"
              title="Export JSON backup"
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </header>

        {/* Feedback banners */}
        {importSuccess && (
          <div className="mb-3 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            ✓ Data imported successfully.
          </div>
        )}
        {importError && (
          <div className="mb-3 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
            <span>{importError}</span>
            <button onClick={() => setImportError(null)} className="ml-2 text-red-400 hover:text-red-300 cursor-pointer">✕</button>
          </div>
        )}

        {/* Streak tracker */}
        <div className="mb-4">
          <StreakTracker
            streak={streak}
            longestStreak={longestStreak}
            completedCount={completedCount}
            totalCount={totalCount}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'Today' && (
          <div className="flex flex-col gap-4">
            <TaskInput onAdd={addTask} />
            <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
          </div>
        )}

        {activeTab === 'History' && (
          <HistoryView history={history} />
        )}

        {activeTab === 'Stats' && (
          <StatsView history={history} streak={streak} longestStreak={longestStreak} />
        )}
      </div>
    </div>
  );
}

# FocusStack

Personal daily execution tracker. Not a todo app — a system for tracking what you actually did, building consistency, and improving output.

## Features

- **Add / Complete / Delete** tasks — today only, no future dates
- **Categories** — Work, Learning, Personal, Crypto
- **Streak system** — a day counts if ≥1 task is completed
- **History** — older days are archived automatically as daily snapshots
- **Stats** — 7-day bar chart, category breakdown, completion rate
- **Import / Export** — backup and restore via JSON
- **PWA** — installable as a desktop app
- **100% local** — no backend, no login, state stays on your machine
- **Local-date aware** — streaks, history, and daily reset use the machine's local calendar date instead of UTC
- **Restart-safe launcher** — the Windows launcher opens the regular browser origin when no installed PWA shortcut exists, which avoids separate storage buckets
- **Disk-backed persistence** — app state is mirrored to a JSON file in Windows app data so reboot/browser storage issues do not wipe your history

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- localStorage + disk-backed JSON persistence
- PWA (manifest + service worker)
- Vitest for regression tests

## Quick Start

```bash
npm install
npm run dev
npm test
```

Open `http://localhost:5173` in your browser.

The dev server is pinned to port `5173`. If that port is unavailable, Vite will fail instead of silently moving to another port and creating what looks like a fresh empty app.

## Windows Launcher

Use [FocusStack.bat](/D:/FocusStack/FocusStack.bat:1) to start the local app.

- If FocusStack is installed as a Chrome/Edge PWA, the launcher opens that installed shortcut.
- If no PWA shortcut exists, the launcher opens a normal browser window at `http://localhost:5173`.
- This fallback is intentional: opening Chrome with `--app=` can use a different storage bucket than a normal tab, which can make your saved data appear missing.

## Persistence

FocusStack now uses two local persistence layers:

- browser `localStorage` for fast in-app state
- a disk snapshot file at `C:\Users\<your-user>\AppData\Local\FocusStack\focusstack-state.json`

On startup, the app restores from the disk snapshot before rendering. During use, the current state is mirrored back to that file. This is the main protection against data loss after reboot, browser cleanup, or browser storage bucket mismatches.

## Project Structure

```
src/
├── components/
│   ├── TaskInput.jsx       # Task input form with category selector
│   ├── TaskList.jsx        # Pending/done task sections
│   ├── TaskItem.jsx        # Individual task with toggle/delete
│   ├── StreakTracker.jsx   # Streak + daily progress bar
│   ├── HistoryView.jsx     # Day-by-day snapshot cards
│   └── StatsView.jsx       # Summary cards, charts, breakdowns
├── hooks/
│   ├── useTasks.js         # Task CRUD, scoped to today
│   ├── useHistory.js       # Daily snapshot management
│   └── useStreak.js        # Consecutive-day tracking
├── utils/
│   ├── storage.js          # localStorage read/write
│   ├── date.js             # Local date helpers
│   ├── dailyReset.js       # Task archival/reset helpers
│   ├── json.js             # Export/import JSON backup
│   └── persistentState.js  # Disk-backed state bootstrap + sync
├── App.jsx                 # Root component, tabs, daily reset
├── main.jsx                # React entry point
└── index.css               # Tailwind v4 base styles
```

## Data Model

```js
// Task
{ id, text, category, completed, createdAt, completedAt }

// Daily Snapshot (in history)
{ date, tasksTotal, tasksCompleted, categories, tasks }

// App State
{ tasks, history, streak, longestStreak, lastActiveDate, lastReset }
```

## Data Behavior

- The `Today` tab only shows tasks whose `createdAt` belongs to the current local date.
- When the date changes, older tasks are moved into `History`.
- If tasks seem to "disappear" after a day change, check the `History` tab first.
- If browser storage is blank on a later launch, FocusStack should restore from the disk snapshot automatically.
- If you already lost old data before this fix, import your JSON backup once to seed the new disk snapshot.

## Testing

```bash
npm test
```

Current regression coverage includes:

- local date rollover
- daily reset and archival behavior
- history item styling
- 7-day stats bucketing
- disk snapshot payload normalization

## Deployment

Vercel-ready. Push to GitHub and connect to Vercel — it just works.

```bash
npm run build   # outputs to /dist
```

## License

MIT

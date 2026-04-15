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
- **100% local** — all data lives in browser localStorage, no backend, no login
- **Local-date aware** — streaks, history, and daily reset use the machine's local calendar date instead of UTC
- **Restart-safe launcher** — the Windows launcher opens the regular browser origin when no installed PWA shortcut exists, which avoids separate storage buckets

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- localStorage persistence
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
│   └── json.js             # Export/import JSON backup
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

// App State (in localStorage)
{ tasks, history, streak, longestStreak, lastActiveDate }
```

## Data Behavior

- The `Today` tab only shows tasks whose `createdAt` belongs to the current local date.
- When the date changes, older tasks are moved into `History`.
- If tasks seem to "disappear" after a day change, check the `History` tab first.
- For persistence across reboot, open FocusStack through the same browser/profile each time.

## Testing

```bash
npm test
```

Current regression coverage includes:

- local date rollover
- daily reset and archival behavior
- history item styling
- 7-day stats bucketing

## Deployment

Vercel-ready. Push to GitHub and connect to Vercel — it just works.

```bash
npm run build   # outputs to /dist
```

## License

MIT

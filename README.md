# FocusStack

Personal daily execution tracker. Not a todo app — a system for tracking what you actually did, building consistency, and improving output.

## Features

- **Add / Complete / Delete** tasks — today only, no future dates
- **Categories** — Work, Learning, Personal, Crypto
- **Streak system** — a day counts if ≥1 task is completed
- **History** — completed tasks archived daily as snapshots
- **Stats** — 7-day bar chart, category breakdown, completion rate
- **Import / Export** — backup and restore via JSON
- **PWA** — installable as a desktop app
- **100% local** — all data in localStorage, no backend, no login

## Tech Stack

- React 18 + Vite
- Tailwind CSS v4
- localStorage persistence
- PWA (manifest + service worker)

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
src/
├── components/
│   ├── TaskInput.jsx       # Task input form with category selector
│   ├── TaskList.jsx        # Pending/done task sections
│   ├── TaskItem.jsx        # Individual task with toggle/delete
│   ├── StreakTracker.jsx    # Streak + daily progress bar
│   ├── HistoryView.jsx     # Day-by-day snapshot cards
│   └── StatsView.jsx       # Summary cards, charts, breakdowns
├── hooks/
│   ├── useTasks.js         # Task CRUD, scoped to today
│   ├── useHistory.js       # Daily snapshot management
│   └── useStreak.js        # Consecutive-day tracking
├── utils/
│   ├── storage.js          # localStorage read/write
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

## Deployment

Vercel-ready. Push to GitHub and connect to Vercel — it just works.

```bash
npm run build   # outputs to /dist
```

## License

MIT

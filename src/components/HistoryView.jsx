import { CATEGORY_STYLES } from '../utils/constants';
import { getToday, getYesterday } from '../utils/date';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');

  if (dateStr === getToday()) return 'Today';
  if (dateStr === getYesterday()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function SnapshotCard({ snapshot }) {
  const pct = snapshot.tasksTotal > 0
    ? Math.round((snapshot.tasksCompleted / snapshot.tasksTotal) * 100)
    : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-white">{formatDate(snapshot.date)}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{snapshot.date}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white leading-none">{snapshot.tasksCompleted}</p>
          <p className="text-xs text-zinc-500">/{snapshot.tasksTotal} done</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Category breakdown */}
      {snapshot.categories && Object.keys(snapshot.categories).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(snapshot.categories).map(([cat, count]) => (
            <span
              key={cat}
              className={`px-2 py-0.5 rounded-full text-xs border ${CATEGORY_STYLES[cat]?.badge || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
            >
              {cat} ×{count}
            </span>
          ))}
        </div>
      )}

      {/* Task list */}
      {snapshot.tasks && snapshot.tasks.length > 0 && (
        <div className="mt-3 flex flex-col gap-1">
          {snapshot.tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.completed ? 'bg-blue-500' : 'bg-zinc-700'}`} />
              <p className={`text-xs ${t.completed ? 'text-zinc-400 line-through' : 'text-zinc-600'}`}>
                {t.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoryView({ history }) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-zinc-500 text-sm">No history yet.</p>
        <p className="text-zinc-600 text-xs mt-1">Complete tasks to build your record.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {history.map((snapshot) => (
        <SnapshotCard key={snapshot.date} snapshot={snapshot} />
      ))}
    </div>
  );
}

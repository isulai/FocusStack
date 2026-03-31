export default function StreakTracker({ streak, longestStreak, completedCount, totalCount }) {
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Streak */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.5 2.5c0 0-1.5 3-1.5 5.5 0 1.1.9 2 2 2s2-.9 2-2c0-.4-.1-.8-.3-1.1C17.1 8.6 18 10.7 18 13c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-3.6 2-6.8 5-8.3-.2.8-.3 1.6-.3 2.3 0 1.1.9 2 2 2s2-.9 2-2V2.5z"/>
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-white leading-none">{streak}</p>
            <p className="text-xs text-zinc-500 mt-0.5">day streak</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-zinc-800" />

        {/* Longest streak */}
        <div className="text-center">
          <p className="text-lg font-semibold text-zinc-300 leading-none">{longestStreak}</p>
          <p className="text-xs text-zinc-500 mt-0.5">best streak</p>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-zinc-800" />

        {/* Today progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-zinc-500">Today</p>
            <p className="text-xs font-medium text-zinc-300">
              {completedCount}/{totalCount}
            </p>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

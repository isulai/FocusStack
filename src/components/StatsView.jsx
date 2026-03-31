const CATEGORIES = ['Work', 'Learning', 'Personal', 'Crypto'];

const CATEGORY_STYLES = {
  Work: { bar: 'bg-blue-500', text: 'text-blue-400' },
  Learning: { bar: 'bg-emerald-500', text: 'text-emerald-400' },
  Personal: { bar: 'bg-purple-500', text: 'text-purple-400' },
  Crypto: { bar: 'bg-amber-500', text: 'text-amber-400' },
};

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-2xl font-bold text-white leading-none">{value}</p>
      <p className="text-xs text-zinc-400 mt-1">{label}</p>
      {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function StatsView({ history, streak, longestStreak }) {
  const totalDays = history.length;
  const totalCompleted = history.reduce((sum, s) => sum + s.tasksCompleted, 0);
  const totalTasks = history.reduce((sum, s) => sum + s.tasksTotal, 0);
  const avgPerDay = totalDays > 0 ? (totalCompleted / totalDays).toFixed(1) : '0';
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Category totals across all history
  const categoryTotals = {};
  CATEGORIES.forEach((cat) => { categoryTotals[cat] = 0; });
  history.forEach((snapshot) => {
    if (snapshot.categories) {
      Object.entries(snapshot.categories).forEach(([cat, count]) => {
        if (categoryTotals[cat] !== undefined) categoryTotals[cat] += count;
      });
    }
  });
  const maxCatCount = Math.max(...Object.values(categoryTotals), 1);

  // Last 7 days bar chart data
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const snap = history.find((s) => s.date === dateStr);
    last7.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: snap?.tasksCompleted || 0,
      isToday: i === 0,
    });
  }
  const maxDay = Math.max(...last7.map((d) => d.count), 1);

  return (
    <div className="flex flex-col gap-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Current Streak" value={`${streak}d`} sub="consecutive days" />
        <StatCard label="Best Streak" value={`${longestStreak}d`} sub="all time" />
        <StatCard label="Tasks Completed" value={totalCompleted} sub={`across ${totalDays} days`} />
        <StatCard label="Completion Rate" value={`${completionRate}%`} sub={`avg ${avgPerDay}/day`} />
      </div>

      {/* Last 7 days */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Last 7 Days</p>
        <div className="flex items-end justify-between gap-1 h-20">
          {last7.map((day) => (
            <div key={day.label} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-full flex items-end justify-center" style={{ height: '56px' }}>
                <div
                  className={`w-full rounded-t-sm transition-all ${day.isToday ? 'bg-blue-500' : 'bg-zinc-700'}`}
                  style={{ height: `${Math.max((day.count / maxDay) * 100, day.count > 0 ? 8 : 0)}%` }}
                />
              </div>
              <p className={`text-xs ${day.isToday ? 'text-blue-400' : 'text-zinc-600'}`}>{day.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">By Category</p>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((cat) => {
            const count = categoryTotals[cat];
            const pct = Math.round((count / maxCatCount) * 100);
            const style = CATEGORY_STYLES[cat];
            return (
              <div key={cat} className="flex items-center gap-3">
                <p className={`text-xs w-16 flex-shrink-0 ${style.text}`}>{cat}</p>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${style.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 w-6 text-right">{count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

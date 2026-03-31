const CATEGORY_STYLES = {
  Work: { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/25', dot: 'bg-blue-400' },
  Learning: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400' },
  Personal: { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/25', dot: 'bg-purple-400' },
  Crypto: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25', dot: 'bg-amber-400' },
};

export default function TaskItem({ task, onToggle, onDelete }) {
  const style = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.Work;

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
        task.completed
          ? 'bg-zinc-900/50 border-zinc-800/50'
          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        id={`toggle-${task.id}`}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
          task.completed
            ? 'bg-blue-600 border-blue-600'
            : 'border-zinc-600 hover:border-blue-500'
        }`}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            task.completed ? 'line-through text-zinc-500' : 'text-zinc-100'
          }`}
        >
          {task.text}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {task.category}
          </span>
          {task.completed && task.completedAt && (
            <span className="text-xs text-zinc-600">
              {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        id={`delete-${task.id}`}
        className="flex-shrink-0 mt-0.5 p-1 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        aria-label="Delete task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

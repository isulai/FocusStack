import { useState } from 'react';
import { CATEGORIES, CATEGORY_STYLES } from '../utils/constants';

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Work');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), category);
    setText('');
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          id="task-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to get done today?"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 text-sm"
          autoComplete="off"
        />
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                category === cat
                  ? CATEGORY_STYLES[cat].inputBtn
                  : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            type="submit"
            disabled={!text.trim()}
            id="add-task-btn"
            className="ml-auto px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

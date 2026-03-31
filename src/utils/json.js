import { loadTasks, loadHistory, loadStreak, loadLongestStreak, loadLastActiveDate } from './storage';

export function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: loadTasks(),
    history: loadHistory(),
    streak: loadStreak(),
    longestStreak: loadLongestStreak(),
    lastActiveDate: loadLastActiveDate(),
  };

  const filename = `focusstack-backup-${new Date().toISOString().split('T')[0]}.json`;
  const json = JSON.stringify(data, null, 2);

  // Use data: URI — works reliably in Chrome PWA mode (blob URLs lose filename in PWAs)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
  const a = document.createElement('a');
  a.href = dataUri;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.version || !Array.isArray(data.tasks) || !Array.isArray(data.history)) {
          reject(new Error('Invalid FocusStack backup file'));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

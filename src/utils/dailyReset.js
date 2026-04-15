import { getDateKeyFromTimestamp, getToday } from './date';

export function partitionTasksByDay(storedTasks = [], today = getToday()) {
  const currentTasks = [];
  const archivedByDate = {};

  storedTasks.forEach((task) => {
    const dayKey = getDateKeyFromTimestamp(task.createdAt, today);

    if (dayKey === today) {
      currentTasks.push(task);
      return;
    }

    if (!archivedByDate[dayKey]) {
      archivedByDate[dayKey] = [];
    }

    archivedByDate[dayKey].push(task);
  });

  return {
    currentTasks,
    archivedTaskGroups: Object.values(archivedByDate),
  };
}

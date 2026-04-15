function pad(value) {
  return String(value).padStart(2, '0');
}

export function getLocalDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getToday(value = new Date()) {
  return getLocalDateKey(value);
}

export function getRelativeLocalDateKey(offsetDays, value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setDate(date.getDate() + offsetDays);
  return getLocalDateKey(date);
}

export function getYesterday(value = new Date()) {
  return getRelativeLocalDateKey(-1, value);
}

export function getDateKeyFromTimestamp(timestamp, fallback = null) {
  return getLocalDateKey(timestamp) ?? fallback;
}

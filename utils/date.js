export function toIso(date = new Date()) {
  return date.toISOString();
}

export function formatTime(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));
}

export function hoursBetween(startIso, endIso = new Date().toISOString()) {
  if (!startIso) return 0;
  return Math.max(0, (new Date(endIso).getTime() - new Date(startIso).getTime()) / 36e5);
}

export function minutesBetween(startIso, endIso = new Date().toISOString()) {
  if (!startIso) return 0;
  return Math.max(0, (new Date(endIso).getTime() - new Date(startIso).getTime()) / 6e4);
}

export function humanDuration(minutes) {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const h = Math.floor(safeMinutes / 60);
  const m = safeMinutes % 60;
  if (h <= 0) return `${m} Min.`;
  if (m === 0) return `${h} Std.`;
  return `${h} Std. ${m} Min.`;
}

export function startOfDayKey(iso = new Date().toISOString()) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

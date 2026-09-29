export const pad = (n) => String(n).padStart(2, '0');

/** Minutes since midnight → "HH:MM" */
export function hhmm(totalMinutes) {
  const m = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

/** Seconds since midnight → "HH:MM:SS" */
export function hhmmss(totalSeconds) {
  const s = ((Math.floor(totalSeconds) % 86400) + 86400) % 86400;
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

export const fmtInt = (n) => Math.round(n).toLocaleString('en-IN');

export function fmtPop(n) {
  return `~${Math.round(n / 100) * 100 >= 1000 ? (Math.round(n / 100) * 100).toLocaleString('en-IN') : Math.round(n)}`;
}

export const fmtPct = (n) => `${Math.round(n)}%`;

export const fmtCoord = ([lat, lng]) => `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;

export function onsetLabel(min) {
  if (min <= 0) return 'Ongoing';
  if (min < 60) return `${Math.round(min)} min`;
  return `${Math.floor(min / 60)} h ${Math.round(min % 60)} min`;
}

export const cx = (...cls) => cls.filter(Boolean).join(' ');

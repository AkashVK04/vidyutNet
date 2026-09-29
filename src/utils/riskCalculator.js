// Risk classification helpers shared by map, panels and alerts.

export const RISK_LEVELS = {
  LOW: { key: 'LOW', label: 'Low', color: '#22c55e', text: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-400/30' },
  MODERATE: { key: 'MODERATE', label: 'Moderate', color: '#facc15', text: 'text-yellow-300', bg: 'bg-yellow-400/15', border: 'border-yellow-400/30' },
  HIGH: { key: 'HIGH', label: 'High', color: '#fb923c', text: 'text-orange-300', bg: 'bg-orange-500/15', border: 'border-orange-400/35' },
  SEVERE: { key: 'SEVERE', label: 'Severe', color: '#ef4444', text: 'text-red-300', bg: 'bg-red-500/15', border: 'border-red-400/40' },
};

export const SEVERITY = {
  CRITICAL: { key: 'CRITICAL', color: '#ef4444', text: 'text-red-300', bg: 'bg-red-500/15', border: 'border-red-500/40', ring: 'ring-red-500/40', rank: 3 },
  HIGH: { key: 'HIGH', color: '#fb923c', text: 'text-orange-300', bg: 'bg-orange-500/15', border: 'border-orange-400/40', ring: 'ring-orange-400/40', rank: 2 },
  MODERATE: { key: 'MODERATE', color: '#facc15', text: 'text-yellow-300', bg: 'bg-yellow-400/15', border: 'border-yellow-400/35', ring: 'ring-yellow-400/40', rank: 1 },
};

/** District / zone risk score (0–100) → level */
export function scoreToLevel(score) {
  if (score >= 75) return RISK_LEVELS.SEVERE;
  if (score >= 55) return RISK_LEVELS.HIGH;
  if (score >= 30) return RISK_LEVELS.MODERATE;
  return RISK_LEVELS.LOW;
}

/** Village lightning probability → warning level */
export function probToLevel(p) {
  if (p >= 85) return RISK_LEVELS.SEVERE;
  if (p >= 70) return RISK_LEVELS.HIGH;
  if (p >= 45) return RISK_LEVELS.MODERATE;
  return RISK_LEVELS.LOW;
}

export function levelAction(levelKey) {
  switch (levelKey) {
    case 'SEVERE':
      return 'SEEK SHELTER NOW';
    case 'HIGH':
      return 'SEEK SHELTER';
    case 'MODERATE':
      return 'MONITOR CONDITIONS';
    default:
      return 'STAY ALERT';
  }
}

export function districtAction(levelKey) {
  switch (levelKey) {
    case 'SEVERE':
      return 'Issue public warning, activate EOC, suspend outdoor activity and alert response teams.';
    case 'HIGH':
      return 'Pre-position response teams, warn schools and utilities, prepare public broadcast.';
    case 'MODERATE':
      return 'Monitor nowcast updates every 10 minutes and alert taluk-level officers.';
    default:
      return 'Routine monitoring. No action required.';
  }
}

/** Radar reflectivity (dBZ) → storm intensity category */
export function dbzToIntensity(dbz) {
  if (dbz >= 58) return { label: 'Extreme', color: '#c084fc' };
  if (dbz >= 50) return { label: 'Severe', color: '#ef4444' };
  if (dbz >= 45) return { label: 'Strong', color: '#fb923c' };
  if (dbz >= 35) return { label: 'Moderate', color: '#facc15' };
  return { label: 'Weak', color: '#38bdf8' };
}

/** Zone level used for risk polygons around a storm cell */
export function dbzToZoneLevel(dbz) {
  if (dbz >= 54) return RISK_LEVELS.SEVERE;
  if (dbz >= 48) return RISK_LEVELS.HIGH;
  if (dbz >= 40) return RISK_LEVELS.MODERATE;
  return RISK_LEVELS.LOW;
}

export const clampPct = (v) => Math.round(Math.min(99, Math.max(1, v)));

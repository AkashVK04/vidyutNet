// Mock nowcast risk zones, rainfall field and wind vectors derived from the storm cells.
import { blob, cone, moveAlong, mulberry32, haversineKm, bearingDeg } from '../utils/geo.js';
import { dbzToZoneLevel } from '../utils/riskCalculator.js';

/**
 * Risk zones sit slightly downstream of each cell (where the hazard is heading).
 * Stronger cells get a larger outer zone plus an inner, more severe core zone.
 */
export function riskZonesFor(cell) {
  if (cell.dbz < 34) return [];
  const level = dbzToZoneLevel(cell.dbz);
  const zones = [];
  const outerR = cell.radiusKm * (1.5 + (cell.dbz - 34) / 40);
  zones.push({
    id: `${cell.id}-RZ-O`,
    cellId: cell.id,
    level: dbzToZoneLevel(cell.dbz - 8),
    positions: blob(cell.pos, outerR, { seed: cell.seed * 31, heading: cell.heading, stretch: 1.55, rough: 0.12, shift: outerR * 0.55 }),
    district: cell.district,
  });
  if (cell.dbz >= 45) {
    zones.push({
      id: `${cell.id}-RZ-I`,
      cellId: cell.id,
      level,
      positions: blob(cell.pos, outerR * 0.55, { seed: cell.seed * 37, heading: cell.heading, stretch: 1.5, rough: 0.12, shift: outerR * 0.5 }),
      district: cell.district,
    });
  }
  return zones;
}

/** Translucent forecast cone (next 30 min) along the predicted storm motion. */
export function predictionCone(cell, minutes = 30) {
  const len = (cell.speedKmh * minutes) / 60;
  return cone(cell.pos, cell.heading, len, cell.radiusKm * 0.7, cell.radiusKm * 1.35);
}

/** Rain-rate polygons (mm/h) — heavier rain in the core, trailing stratiform region. */
export const RAIN_SCALE = [
  { mm: 2.5, color: '#60a5fa', label: '2.5' },
  { mm: 10, color: '#3b82f6', label: '10' },
  { mm: 25, color: '#6366f1', label: '25' },
  { mm: 50, color: '#a855f7', label: '50+' },
];

export function rainfallField(cell) {
  const rate = Math.max(0, (cell.dbz - 25) * 1.6); // crude Z-R stand-in
  return RAIN_SCALE.filter((l) => rate >= l.mm).map((l, i) => {
    const r = cell.radiusKm * (1.25 - i * 0.26);
    return {
      key: `${cell.id}-rain-${i}`,
      color: l.color,
      mm: l.mm,
      positions: blob(moveAlong(cell.pos, cell.heading + 180, r * 0.35), r, { seed: cell.seed * 53 + i, heading: cell.heading, stretch: 1.7, rough: 0.2 }),
    };
  });
}

/** Wind vector grid: SW monsoon-type steering flow enhanced near active cells. */
export function windField(cells, bounds = { s: 12.2, n: 13.65, w: 76.5, e: 78.2 }, rows = 7, cols = 9) {
  const vectors = [];
  const rand = mulberry32(77);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lat = bounds.s + ((r + 0.5) / rows) * (bounds.n - bounds.s);
      const lng = bounds.w + ((c + 0.5) / cols) * (bounds.e - bounds.w);
      const p = [lat, lng];
      let dir = 42 + (rand() - 0.5) * 18; // heading the wind blows TOWARD
      let speed = 14 + rand() * 8; // km/h
      cells.forEach((cell) => {
        const d = haversineKm(p, cell.pos);
        if (d < cell.radiusKm * 3) {
          const gust = ((cell.dbz - 30) / 30) * 40 * (1 - d / (cell.radiusKm * 3));
          speed += Math.max(0, gust);
          // outflow: winds diverge away from the core
          const away = bearingDeg(cell.pos, p);
          dir = dir * 0.55 + away * 0.45;
        }
      });
      vectors.push({ id: `w-${r}-${c}`, pos: p, dir, speed: Math.round(speed) });
    }
  }
  return vectors;
}

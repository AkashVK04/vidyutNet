// Mock Lightning Location Network output. Strikes are generated deterministically
// around each storm cell's recent track so they form realistic trailing clusters.
import { mulberry32, gauss, moveAlong, offsetKm, clamp } from '../utils/geo.js';
import { stormCells, cellStateAt } from './stormCellsData.js';
import { BASE_MINUTES } from './timelineData.js';
import { hhmm } from '../utils/formatters.js';

export const lightningNetwork = {
  name: 'Lightning Location Network (LLN)',
  sensors: 18,
  coverage: 91,
  lastUpdate: '09:41',
  detectionEfficiency: '~90% CG / ~70% IC (demo)',
};

// Total strikes in the trailing 30-minute window, per timeline step.
export const strikeTotals = [148, 176, 214, 262, 298, 231, 164];

// Strikes per 5-minute bin (last 60 min) used for rate charts.
export const strikeRateHistory = [
  { t: '08:45', cg: 4, ic: 9 }, { t: '08:50', cg: 6, ic: 11 }, { t: '08:55', cg: 5, ic: 14 },
  { t: '09:00', cg: 8, ic: 15 }, { t: '09:05', cg: 9, ic: 18 }, { t: '09:10', cg: 11, ic: 19 },
  { t: '09:15', cg: 10, ic: 22 }, { t: '09:20', cg: 13, ic: 24 }, { t: '09:25', cg: 12, ic: 23 },
  { t: '09:30', cg: 15, ic: 27 }, { t: '09:35', cg: 17, ic: 29 }, { t: '09:40', cg: 19, ic: 33 },
];

// Lightning-producing weight per cell (share of total strikes).
function cellWeight(state) {
  return Math.max(0, state.dbz - 34) ** 1.6;
}

/**
 * Generate strikes for step t. Returns [{id, pos, ageMin, type, kA, cellId, time}].
 * `extra` adds strikes (Simulation Mode) without reshuffling existing ones.
 */
export function generateStrikes(t, extra = 0) {
  const step = Math.round(t);
  const total = strikeTotals[clamp(step, 0, strikeTotals.length - 1)] + extra;
  const states = stormCells.map((c) => cellStateAt(c, t));
  const weights = states.map(cellWeight);
  const wsum = weights.reduce((a, b) => a + b, 0) || 1;
  const strikes = [];
  states.forEach((s, ci) => {
    const n = Math.round((weights[ci] / wsum) * total);
    const rand = mulberry32(s.seed * 1000 + step * 17 + 3);
    for (let k = 0; k < n; k++) {
      const ageMin = Math.floor(rand() * 30);
      // place along the recent track (older strikes trail behind the cell)
      const back = (s.speedKmh * ageMin) / 60;
      const c = moveAlong(s.pos, s.heading + 180, back);
      const spread = s.radiusKm * 0.55;
      const pos = offsetKm(c, gauss(rand) * spread, gauss(rand) * spread);
      const cg = rand() < 0.32;
      const kA = Math.round((cg ? 12 + rand() * 48 : 4 + rand() * 18) * (rand() < 0.88 ? -1 : 1));
      strikes.push({
        id: `${s.id}-${step}-${k}`,
        pos,
        ageMin,
        type: cg ? 'CG' : 'IC',
        kA,
        cellId: s.id,
        district: s.district,
        time: hhmm(BASE_MINUTES + step * 10 - ageMin),
      });
    }
  });
  return strikes.sort((a, b) => b.ageMin - a.ageMin);
}

// Top lightning clusters (Lightning Intelligence page) — values at NOW, scaled by step.
export const lightningClusters = [
  { id: 'C1', cells: ['KAR-042', 'KAR-038'], name: 'Ramanagara', strikes: 68, risk: 'HIGH', center: [12.75, 77.3], trend: [42, 51, 60, 68], growth: 18 },
  { id: 'C2', cells: ['KAR-045'], name: 'Bengaluru Rural', strikes: 41, risk: 'MODERATE', center: [12.98, 77.26], trend: [22, 28, 35, 41], growth: 24 },
  { id: 'C3', cells: ['KAR-031'], name: 'Tumakuru', strikes: 23, risk: 'MODERATE', center: [13.3, 77.0], trend: [18, 20, 22, 23], growth: 6 },
  { id: 'C4', cells: ['KAR-029'], name: 'Chikkaballapur', strikes: 16, risk: 'LOW', center: [13.45, 77.6], trend: [9, 11, 14, 16], growth: 12 },
];

export const clusterScaleByStep = [1, 1.17, 1.42, 1.74, 1.98, 1.54, 1.09];

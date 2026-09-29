// Mock storm cells — per-step profiles for the 0–60 min nowcast (7 steps, 10-min spacing).
// All values are synthetic demonstration data.
import { atStep, moveAlong, clamp } from '../utils/geo.js';
import { STEP_MINUTES } from './timelineData.js';

export const stormCells = [
  {
    id: 'KAR-042', district: 'Ramanagara District', locality: 'Ramanagara', seed: 42,
    start: [12.712, 77.27], heading: 48, speedKmh: 24,
    dbz: [52, 55, 58, 61, 62, 56, 47], radiusKm: [8.4, 9.2, 10.3, 11.3, 12.2, 11.3, 9.7],
    base: { lightningProb: 87, severeProb: 78, areaKm2: 18.6, confidence: 91 },
    impact: '09:55 – 10:35 IST', echoTop: 14.2, vil: 48,
  },
  {
    id: 'KAR-038', district: 'Ramanagara District', locality: 'Kanakapura', seed: 38,
    start: [12.55, 77.385], heading: 42, speedKmh: 21,
    dbz: [47, 50, 53, 55, 54, 49, 43], radiusKm: [6.8, 7.4, 8.1, 8.6, 8.9, 8.4, 7.6],
    base: { lightningProb: 74, severeProb: 58, areaKm2: 12.4, confidence: 88 },
    impact: '10:05 – 10:40 IST', echoTop: 12.6, vil: 36,
  },
  {
    id: 'KAR-045', district: 'Bengaluru Rural', locality: 'Magadi', seed: 45,
    start: [12.93, 77.19], heading: 52, speedKmh: 26,
    dbz: [44, 48, 51, 54, 57, 55, 50], radiusKm: [6.5, 7.3, 8.1, 9.2, 10.0, 10.3, 9.7],
    base: { lightningProb: 62, severeProb: 44, areaKm2: 10.8, confidence: 86 },
    impact: '10:10 – 10:55 IST', echoTop: 11.8, vil: 31,
  },
  {
    id: 'KAR-031', district: 'Tumakuru District', locality: 'Kunigal', seed: 31,
    start: [13.28, 76.98], heading: 55, speedKmh: 18,
    dbz: [41, 43, 45, 46, 44, 40, 36], radiusKm: [5.9, 6.2, 6.5, 6.8, 6.5, 5.9, 5.4],
    base: { lightningProb: 48, severeProb: 26, areaKm2: 9.2, confidence: 84 },
    impact: '10:15 – 10:50 IST', echoTop: 10.4, vil: 22,
  },
  {
    id: 'KAR-047', district: 'Mandya District', locality: 'Maddur', seed: 47,
    start: [12.57, 77.0], heading: 50, speedKmh: 22,
    dbz: [38, 41, 44, 45, 43, 39, 34], radiusKm: [5.4, 5.8, 6.2, 6.5, 6.2, 5.7, 5.1],
    base: { lightningProb: 36, severeProb: 18, areaKm2: 7.4, confidence: 82 },
    impact: '10:20 – 10:50 IST', echoTop: 9.6, vil: 18,
  },
  {
    id: 'KAR-029', district: 'Chikkaballapur District', locality: 'Gauribidanur', seed: 29,
    start: [13.44, 77.58], heading: 60, speedKmh: 16,
    dbz: [33, 35, 38, 41, 44, 46, 44], radiusKm: [4.9, 5.1, 5.4, 5.8, 6.2, 6.5, 6.2],
    base: { lightningProb: 24, severeProb: 10, areaKm2: 5.6, confidence: 79 },
    impact: '10:30 – 11:10 IST', echoTop: 8.8, vil: 12,
  },
  {
    id: 'KAR-050', district: 'Kolar District', locality: 'Malur', seed: 50,
    start: [13.0, 77.98], heading: 45, speedKmh: 15,
    dbz: [30, 31, 33, 35, 37, 38, 36], radiusKm: [4.3, 4.5, 4.7, 5.0, 5.3, 5.4, 5.1],
    base: { lightningProb: 18, severeProb: 6, areaKm2: 4.1, confidence: 76 },
    impact: '10:40 – 11:20 IST', echoTop: 7.9, vil: 9,
  },
  {
    id: 'KAR-036', district: 'Mysuru District', locality: 'Srirangapatna', seed: 36,
    start: [12.38, 76.72], heading: 40, speedKmh: 20,
    dbz: [36, 34, 32, 30, 28, 26, 24], radiusKm: [5.7, 5.4, 5.1, 4.7, 4.3, 4.1, 3.8],
    base: { lightningProb: 22, severeProb: 8, areaKm2: 6.2, confidence: 80 },
    impact: 'Dissipating', echoTop: 8.2, vil: 11,
  },
];

export const PRIMARY_CELL_ID = 'KAR-042';

/**
 * Resolve a storm cell at fractional timeline step t.
 * jitter (±dBZ) is applied by Simulation Mode to make values fluctuate.
 */
export function cellStateAt(cell, t, jitter = 0) {
  const dbz = clamp(atStep(cell.dbz, t) + jitter, 10, 70);
  const radiusKm = atStep(cell.radiusKm, t);
  const distKm = (cell.speedKmh * STEP_MINUTES * t) / 60;
  const pos = moveAlong(cell.start, cell.heading, distKm);
  const d0 = cell.dbz[0];
  const lightningProb = clamp(cell.base.lightningProb + (dbz - d0) * 1.4, 3, 97);
  const severeProb = clamp(cell.base.severeProb + (dbz - d0) * 1.8, 2, 96);
  const areaKm2 = cell.base.areaKm2 * (radiusKm / cell.radiusKm[0]) ** 2;
  const confidence = clamp(cell.base.confidence - t * 1.2, 60, 99);
  return { ...cell, dbzProfile: cell.dbz, t, dbz, radiusKm, pos, lightningProb, severeProb, areaKm2, confidence };
}

/** Future positions for the prediction track (+10/+20/+30 min from step t). */
export function futurePositions(cell, t, steps = 3) {
  const out = [];
  for (let k = 1; k <= steps; k++) {
    out.push(moveAlong(cell.start, cell.heading, (cell.speedKmh * STEP_MINUTES * (t + k)) / 60));
  }
  return out;
}

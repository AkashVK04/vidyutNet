// Mock INSAT-3D / INSAT-3DR TIR-1 (10.8 µm) cloud-top brightness temperature overlay.
import { blob } from '../utils/geo.js';

export const satelliteMeta = {
  platform: 'INSAT-3D / INSAT-3DR',
  channel: 'TIR-1 10.8 µm',
  lastScan: '09:38',
  cadence: '15 min (rapid scan: 7.5 min)',
  minCloudTop: -61,
  thermalAnomaly: 'High',
};

export const IR_SCALE = [
  { temp: -32, color: '#94a3b8', opacity: 0.1, label: '−32' },
  { temp: -45, color: '#7dd3fc', opacity: 0.12, label: '−45' },
  { temp: -55, color: '#22d3ee', opacity: 0.14, label: '−55' },
  { temp: -61, color: '#e879f9', opacity: 0.18, label: '−61' },
];

/** Cloud-shield polygons around a resolved storm cell (anvil spreads downstream). */
export function irCloudShields(cell) {
  const strength = (cell.dbz - 28) / 34; // 0..1
  const out = [];
  IR_SCALE.forEach((lvl, i) => {
    const needed = i / IR_SCALE.length;
    if (strength < needed * 0.9) return;
    const r = cell.radiusKm * (2.6 - i * 0.48) * (0.7 + strength * 0.5);
    out.push({
      key: `${cell.id}-ir-${i}`,
      color: lvl.color,
      opacity: lvl.opacity,
      positions: blob(cell.pos, r, { seed: cell.seed * 13 + i, heading: cell.heading, stretch: 1.6, rough: 0.22, shift: r * 0.35 }),
    });
  });
  return out;
}

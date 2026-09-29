// Mock Doppler Weather Radar network + reflectivity rendering scale.
import { blob } from '../utils/geo.js';

export const radarStations = [
  { id: 'DWR-BLR', name: 'DWR Bengaluru (S-band)', band: 'S-band', pos: [13.07, 77.6], rangeKm: 150, status: 'ONLINE', lastScan: '09:40', elevation: '0.5°–21°' },
  { id: 'DWR-MYS', name: 'DWR Mysuru (C-band)', band: 'C-band', pos: [12.31, 76.65], rangeKm: 100, status: 'ONLINE', lastScan: '09:40', elevation: '0.5°–18°' },
  { id: 'XWR-TMK', name: 'X-band Tumakuru', band: 'X-band', pos: [13.29, 77.18], rangeKm: 60, status: 'ONLINE', lastScan: '09:39', elevation: '1°–30°' },
  { id: 'XWR-RMN', name: 'X-band Ramanagara', band: 'X-band', pos: [12.77, 77.36], rangeKm: 60, status: 'DEGRADED', lastScan: '09:36', elevation: '1°–30°' },
];

// Reflectivity colour scale (dBZ)
export const DBZ_SCALE = [
  { dbz: 20, color: '#1d6fe8', label: '20' },
  { dbz: 30, color: '#16c47f', label: '30' },
  { dbz: 40, color: '#facc15', label: '40' },
  { dbz: 50, color: '#f97316', label: '50' },
  { dbz: 55, color: '#ef4444', label: '55' },
  { dbz: 60, color: '#c026d3', label: '60+' },
];

/** Build nested reflectivity contour polygons for a resolved storm cell state. */
export function reflectivityRings(cell) {
  const rings = [];
  DBZ_SCALE.forEach((lvl, i) => {
    if (cell.dbz < lvl.dbz) return;
    const frac = (cell.dbz - lvl.dbz + 4) / (cell.dbz - 16);
    const r = Math.max(0.6, cell.radiusKm * frac);
    rings.push({
      key: `${cell.id}-${lvl.dbz}`,
      color: lvl.color,
      dbz: lvl.dbz,
      positions: blob(cell.pos, r, {
        seed: cell.seed * 7 + i,
        heading: cell.heading,
        stretch: 1.4,
        rough: 0.2 - i * 0.02,
        shift: r * 0.18 * i * 0.3, // cores lean toward the leading edge
      }),
    });
  });
  return rings;
}

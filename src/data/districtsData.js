// Mock district data. Boundaries are an approximate Voronoi tessellation of district
// centroids — clearly labelled in the UI as approximate demonstration boundaries.
import { Delaunay } from 'd3-delaunay';
import { atStep } from '../utils/geo.js';

export const districts = [
  { id: 'BLR-U', name: 'Bengaluru Urban', centroid: [12.97, 77.59], labelPos: [12.84, 77.7], population: 9621000, hq: 'Bengaluru',
    risk: [35, 42, 52, 62, 70, 74, 68] },
  { id: 'BLR-R', name: 'Bengaluru Rural', centroid: [13.22, 77.5], population: 990900, hq: 'Doddaballapur',
    risk: [48, 55, 64, 74, 84, 86, 80] },
  { id: 'RMN', name: 'Ramanagara', centroid: [12.66, 77.33], population: 1082600, hq: 'Ramanagara',
    risk: [74, 81, 87, 92, 95, 84, 70] },
  { id: 'TMK', name: 'Tumakuru', centroid: [13.4, 76.92], population: 2678900, hq: 'Tumakuru',
    risk: [44, 48, 52, 55, 52, 46, 40] },
  { id: 'CBP', name: 'Chikkaballapur', centroid: [13.48, 77.78], population: 1255100, hq: 'Chikkaballapur',
    risk: [22, 26, 30, 36, 44, 52, 56] },
  { id: 'MYS', name: 'Mysuru', centroid: [12.2, 76.4], population: 3001100, hq: 'Mysuru',
    risk: [18, 16, 14, 12, 10, 10, 8] },
  { id: 'MND', name: 'Mandya', centroid: [12.55, 76.85], population: 1805800, hq: 'Mandya',
    risk: [38, 36, 34, 30, 26, 22, 18] },
  { id: 'KLR', name: 'Kolar', centroid: [13.1, 78.18], population: 1536400, hq: 'Kolar',
    risk: [12, 14, 18, 22, 28, 34, 38] },
];

// Neighbouring (non-displayed) centroids that shape the outer boundaries.
const ghostCentroids = [
  [12.95, 76.05], [11.95, 77.0], [12.45, 78.05], [14.05, 76.55], [14.15, 77.6],
  [13.55, 78.75], [12.25, 75.75], [12.05, 77.85], [13.7, 76.2], [11.9, 76.3],
];

const BOUNDS = [75.9, 11.85, 78.75, 14.0]; // [minLng, minLat, maxLng, maxLat]

function buildBoundaries() {
  const pts = [...districts.map((d) => [d.centroid[1], d.centroid[0]]), ...ghostCentroids.map(([la, ln]) => [ln, la])];
  const voronoi = Delaunay.from(pts).voronoi(BOUNDS);
  const out = {};
  districts.forEach((d, i) => {
    const poly = voronoi.cellPolygon(i) || [];
    out[d.id] = poly.map(([lng, lat]) => [lat, lng]);
  });
  return out;
}

export const districtBoundaries = buildBoundaries();

export function districtStateAt(d, t, riskJitter = 0) {
  const score = Math.max(2, Math.min(99, atStep(d.risk, t) + riskJitter));
  const lightningProb = Math.min(98, Math.max(3, score * 0.95 + 4));
  const rainfallProb = Math.min(98, Math.max(5, score * 0.85 + 10));
  const thunderstormProb = Math.min(97, Math.max(3, score * 0.9));
  const exposureFrac = Math.max(0, (score - 30) / 70) * 0.06;
  const affectedPopulation = Math.round(d.population * exposureFrac);
  return { ...d, score, lightningProb, rainfallProb, thunderstormProb, affectedPopulation };
}

export const cityLabels = [
  { name: 'Bengaluru', pos: [12.972, 77.594], major: true },
  { name: 'Mysuru', pos: [12.296, 76.639], major: true },
  { name: 'Tumakuru', pos: [13.341, 77.101], major: true },
  { name: 'Mandya', pos: [12.524, 76.895], major: false },
  { name: 'Ramanagara', pos: [12.722, 77.281], major: false },
  { name: 'Kolar', pos: [13.137, 78.13], major: false },
  { name: 'Chikkaballapur', pos: [13.435, 77.728], major: false },
];

// Hyperlocal (village / locality level) warning targets — synthetic demonstration data.
// `prob` = lightning probability (%) per timeline step; `onset` = minutes to onset at NOW.
import { atStep } from '../utils/geo.js';
import { probToLevel, levelAction } from '../utils/riskCalculator.js';

export const villages = [
  { id: 'V01', name: 'Kanakapura', taluk: 'Kanakapura', district: 'Ramanagara', pos: [12.546, 77.419], population: 8420, onset: 18,
    prob: [84, 88, 91, 93, 90, 78, 60], shelters: ['Govt. PU College Hall', 'Taluk Office Annex'] },
  { id: 'V02', name: 'Magadi', taluk: 'Magadi', district: 'Ramanagara', pos: [12.957, 77.224], population: 6150, onset: 32,
    prob: [62, 70, 78, 84, 88, 82, 70], shelters: ['Community Hall', 'Govt. Higher Primary School'] },
  { id: 'V03', name: 'Ramanagara', taluk: 'Ramanagara', district: 'Ramanagara', pos: [12.722, 77.281], population: 9870, onset: 6,
    prob: [88, 90, 86, 76, 62, 48, 34], shelters: ['Community Hall', 'Government School', 'Panchayat Office'] },
  { id: 'V04', name: 'Channapatna', taluk: 'Channapatna', district: 'Ramanagara', pos: [12.651, 77.209], population: 7200, onset: 12,
    prob: [79, 83, 80, 72, 60, 45, 32], shelters: ['Town Municipal Hall'] },
  { id: 'V05', name: 'Bidadi', taluk: 'Ramanagara', district: 'Ramanagara', pos: [12.797, 77.388], population: 5380, onset: 22,
    prob: [71, 80, 88, 92, 90, 80, 64], shelters: ['Gram Panchayat Office', 'KSRTC Depot Hall'] },
  { id: 'V06', name: 'Harohalli', taluk: 'Kanakapura', district: 'Ramanagara', pos: [12.68, 77.474], population: 4210, onset: 26,
    prob: [66, 74, 82, 86, 84, 72, 55], shelters: ['Govt. High School'] },
  { id: 'V07', name: 'Kengeri', taluk: 'Bengaluru South', district: 'Bengaluru Urban', pos: [12.912, 77.483], population: 11200, onset: 38,
    prob: [52, 60, 70, 79, 85, 82, 72], shelters: ['BBMP Ward Office', 'Metro Station Concourse'] },
  { id: 'V08', name: 'Nelamangala', taluk: 'Nelamangala', district: 'Bengaluru Rural', pos: [13.097, 77.393], population: 6930, onset: 44,
    prob: [44, 52, 62, 72, 80, 84, 80], shelters: ['Taluk Office Hall'] },
  { id: 'V09', name: 'Kunigal', taluk: 'Kunigal', district: 'Tumakuru', pos: [13.023, 77.027], population: 3960, onset: 30,
    prob: [48, 54, 58, 60, 56, 48, 40], shelters: ['Govt. Primary School'] },
  { id: 'V10', name: 'Doddaballapur', taluk: 'Doddaballapur', district: 'Bengaluru Rural', pos: [13.292, 77.537], population: 7540, onset: 58,
    prob: [28, 34, 42, 52, 62, 70, 74], shelters: ['Town Hall'] },
  { id: 'V11', name: 'Hoskote', taluk: 'Hoskote', district: 'Bengaluru Rural', pos: [13.07, 77.798], population: 5610, onset: 70,
    prob: [18, 22, 28, 36, 44, 52, 58], shelters: ['Gram Panchayat Office'] },
  { id: 'V12', name: 'Devanahalli', taluk: 'Devanahalli', district: 'Bengaluru Rural', pos: [13.247, 77.712], population: 4880, onset: 75,
    prob: [16, 20, 26, 34, 42, 50, 56], shelters: ['Govt. High School'] },
];

export function villageStateAt(v, t, jitter = 0) {
  const p = Math.max(2, Math.min(98, atStep(v.prob, t) + jitter));
  const prev = atStep(v.prob, Math.max(0, t - 1));
  const onsetMin = v.onset - t * 10;
  const level = probToLevel(p);
  let onsetText;
  if (onsetMin > 0) onsetText = `${Math.round(onsetMin)} min`;
  else if (p < prev - 4) onsetText = 'Clearing';
  else onsetText = 'Ongoing';
  return { ...v, lightningProb: p, onsetMin, onsetText, level, action: levelAction(level.key) };
}

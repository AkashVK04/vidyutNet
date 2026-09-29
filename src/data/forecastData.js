// 3-hour extended forecast (secondary product) and nowcast panel summaries — demonstration data.

export const threeHourForecast = [
  { label: 'NOW', time: '09:40', intensity: 52, lightning: 148, rainfall: 18, risk: 72, confidence: 95 },
  { label: '+30 min', time: '10:10', intensity: 61, lightning: 262, rainfall: 42, risk: 92, confidence: 91 },
  { label: '+60 min', time: '10:40', intensity: 56, lightning: 214, rainfall: 36, risk: 84, confidence: 87 },
  { label: '+90 min', time: '11:10', intensity: 47, lightning: 132, rainfall: 22, risk: 66, confidence: 78 },
  { label: '+120 min', time: '11:40', intensity: 40, lightning: 71, rainfall: 11, risk: 44, confidence: 69 },
  { label: '+180 min', time: '12:40', intensity: 31, lightning: 18, rainfall: 3, risk: 21, confidence: 58 },
];

// Nowcast headline products (values at NOW; panels scale these with the timeline).
export const nowcastProducts = {
  precipitation: {
    title: 'Precipitation', subtitle: 'Next 60 minutes', level: 'HIGH',
    metricLabel: 'Peak rain rate', unit: 'mm/h', values: [38, 44, 52, 58, 61, 48, 32],
    probability: [82, 85, 88, 90, 88, 80, 66], peak: '10:15 IST', confidence: 89,
    region: 'Ramanagara → Bengaluru SW', trend: 'Increasing',
  },
  lightning: {
    title: 'Lightning', subtitle: 'Next 60 minutes', level: 'HIGH',
    metricLabel: 'Flash density', unit: 'fl/km²/h', values: [4.2, 5.1, 6.3, 7.4, 8.1, 6.0, 3.9],
    probability: [87, 89, 91, 92, 90, 81, 64], peak: '10:10 IST', confidence: 91,
    region: 'Ramanagara, Kanakapura, Bidadi', trend: 'Increasing',
  },
  severe: {
    title: 'Severe Weather Risk', subtitle: 'Next 60 minutes', level: 'SEVERE',
    metricLabel: 'Risk index', unit: '/100', values: [72, 80, 87, 92, 95, 84, 70],
    probability: [78, 82, 86, 90, 91, 80, 62], peak: '10:20 IST', confidence: 88,
    region: 'Ramanagara, Bengaluru Rural', trend: 'Increasing',
  },
};

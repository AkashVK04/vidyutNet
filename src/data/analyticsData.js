// Model performance — PROTOTYPE / DEMONSTRATION METRICS ONLY (not verified measurements).

export const reflectivityForecast = [
  { t: '08:00', observed: 22, forecast: 24 }, { t: '08:10', observed: 25, forecast: 26 },
  { t: '08:20', observed: 29, forecast: 28 }, { t: '08:30', observed: 33, forecast: 31 },
  { t: '08:40', observed: 36, forecast: 35 }, { t: '08:50', observed: 39, forecast: 40 },
  { t: '09:00', observed: 42, forecast: 43 }, { t: '09:10', observed: 45, forecast: 44 },
  { t: '09:20', observed: 48, forecast: 47 }, { t: '09:30', observed: 50, forecast: 51 },
  { t: '09:40', observed: 52, forecast: 53 }, { t: '09:50', forecast: 55 }, { t: '10:00', forecast: 58 },
  { t: '10:10', forecast: 61 }, { t: '10:20', forecast: 62 }, { t: '10:30', forecast: 56 }, { t: '10:40', forecast: 47 },
];

export const lightningDensity = [
  { t: '08:40', observed: 12, predicted: 14 }, { t: '08:50', observed: 18, predicted: 17 },
  { t: '09:00', observed: 23, predicted: 25 }, { t: '09:10', observed: 30, predicted: 28 },
  { t: '09:20', observed: 37, predicted: 38 }, { t: '09:30', observed: 42, predicted: 44 },
  { t: '09:40', observed: 52, predicted: 50 }, { t: '09:50', predicted: 58 }, { t: '10:00', predicted: 71 },
  { t: '10:10', predicted: 86 }, { t: '10:20', predicted: 94 }, { t: '10:30', predicted: 72 },
];

export const confidenceByLead = [
  { lead: '10', confidence: 96, csi: 0.81 }, { lead: '20', confidence: 94, csi: 0.77 },
  { lead: '30', confidence: 91, csi: 0.74 }, { lead: '40', confidence: 88, csi: 0.71 },
  { lead: '50', confidence: 85, csi: 0.69 }, { lead: '60', confidence: 82, csi: 0.68 },
  { lead: '90', confidence: 74, csi: 0.59 }, { lead: '120', confidence: 66, csi: 0.51 },
  { lead: '180', confidence: 55, csi: 0.4 },
];

export const alertAccuracy = [
  { week: 'W31', hit: 81, far: 29 }, { week: 'W32', hit: 83, far: 27 }, { week: 'W33', hit: 82, far: 26 },
  { week: 'W34', hit: 85, far: 25 }, { week: 'W35', hit: 86, far: 24 }, { week: 'W36', hit: 84, far: 25 },
  { week: 'W37', hit: 87, far: 23 }, { week: 'W38', hit: 88, far: 22 }, { week: 'W39', hit: 87, far: 24 },
];

// Contingency table for lightning occurrence at 1 km / 60 min.
export const confusionMatrix = { hits: 142, misses: 21, falseAlarms: 46, correctNegatives: 1391 };

export function skillScores(m = confusionMatrix) {
  const pod = m.hits / (m.hits + m.misses);
  const far = m.falseAlarms / (m.hits + m.falseAlarms);
  const csi = m.hits / (m.hits + m.misses + m.falseAlarms);
  const total = m.hits + m.misses + m.falseAlarms + m.correctNegatives;
  const acc = (m.hits + m.correctNegatives) / total;
  const bias = (m.hits + m.falseAlarms) / (m.hits + m.misses);
  return { pod, far, csi, acc, bias, total };
}

export const modelInfo = {
  name: 'VidyutNet Nowcasting Engine',
  type: 'Spatiotemporal Deep Learning',
  architecture: 'ConvLSTM encoder–decoder with multi-source fusion (radar · satellite · lightning · NWP)',
  latency: '12 sec',
  resolution: '1 km',
  horizon: '0–3 hours',
  refresh: '10 minutes',
  confidence: '91%',
  version: 'v0.9-demo',
};

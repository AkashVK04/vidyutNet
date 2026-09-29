// Data sources, pipeline health, notifications, KPIs and stakeholder roles — demonstration data.

export const dataSources = [
  {
    id: 'radar', name: 'Doppler Weather Radar', short: 'DWR', status: 'ONLINE',
    stats: [
      { label: 'Coverage', value: '94%' },
      { label: 'Last update', value: '09:40 IST' },
      { label: 'Signal', value: 'Excellent' },
      { label: 'Volume scan', value: '10 min' },
    ],
    products: ['Z', 'ZDR', 'KDP', 'Vr', 'ρHV'],
    latency: [38, 41, 36, 39, 44, 37, 35, 40, 38, 36, 39, 37],
  },
  {
    id: 'satellite', name: 'INSAT-3D / INSAT-3DR', short: 'SAT', status: 'ONLINE',
    stats: [
      { label: 'Last scan', value: '09:38 IST' },
      { label: 'Cloud top temp.', value: '−61 °C' },
      { label: 'Thermal anomaly', value: 'High' },
      { label: 'Cadence', value: '15 min' },
    ],
    products: ['TIR-1', 'TIR-2', 'WV', 'VIS', 'CTT'],
    latency: [62, 58, 66, 61, 64, 59, 63, 60, 65, 62, 58, 61],
  },
  {
    id: 'lightning', name: 'Lightning Location Network', short: 'LLN', status: 'ONLINE',
    stats: [
      { label: 'Last update', value: '09:41 IST' },
      { label: 'Strikes detected', value: '148' },
      { label: 'Coverage', value: '91%' },
      { label: 'Sensors', value: '18 / 18' },
    ],
    products: ['CG', 'IC', 'Peak kA', 'Polarity'],
    latency: [4, 5, 4, 3, 5, 4, 4, 6, 4, 3, 4, 5],
  },
];

export const pipelineStages = [
  { id: 'radar-in', name: 'Radar ingestion', status: 'Healthy', latency: '38 s', throughput: '1.2 GB/h' },
  { id: 'sat-in', name: 'Satellite ingestion', status: 'Healthy', latency: '61 s', throughput: '640 MB/h' },
  { id: 'lln-in', name: 'Lightning ingestion', status: 'Healthy', latency: '4 s', throughput: '9.1k evt/h' },
  { id: 'prep', name: 'Preprocessing', status: 'Healthy', latency: '21 s', throughput: 'QC · regrid 1 km' },
  { id: 'ai', name: 'AI inference', status: 'Healthy', latency: '12 s', throughput: '6 runs/h' },
  { id: 'alert', name: 'Alert engine', status: 'Healthy', latency: '2 s', throughput: '7 active' },
];

export const systemHealth = [
  { id: 'radar', name: 'Radar ingestion' },
  { id: 'sat', name: 'Satellite ingestion' },
  { id: 'lln', name: 'Lightning ingestion' },
  { id: 'ai', name: 'AI inference' },
  { id: 'map', name: 'Map services' },
  { id: 'alert', name: 'Alert engine' },
];

export const initialNotifications = [
  { id: 'n1', time: '09:42', title: 'New severe thunderstorm detected', detail: 'Cell KAR-042 · Ramanagara · 52 dBZ', type: 'critical', read: false },
  { id: 'n2', time: '09:40', title: 'Lightning cluster intensified', detail: '+18% strikes in last 10 min', type: 'warning', read: false },
  { id: 'n3', time: '09:38', title: 'Satellite thermal anomaly detected', detail: 'INSAT-3D cloud top −61 °C', type: 'info', read: false },
  { id: 'n4', time: '09:35', title: 'Radar data updated', detail: 'DWR Bengaluru volume scan ingested', type: 'ok', read: true },
];

// KPI values per timeline step.
export const kpiSeries = {
  stormCells: [12, 12, 13, 14, 14, 12, 10],
  highRiskZones: [7, 8, 9, 11, 12, 9, 7],
  villagesAtRisk: [34, 41, 52, 63, 71, 58, 44],
  radarCoverage: 94,
  leadTime: '45–60 min',
};

export const ROLES = [
  { id: 'ddma', label: 'DDMA Officer', short: 'DDMA', focus: 'Alerts · affected population · risk map' },
  { id: 'ndrf', label: 'NDRF / SDRF', short: 'NDRF', focus: 'Villages at risk · response staging' },
  { id: 'power', label: 'Power Utility', short: 'Power', focus: 'Lightning · transmission assets · storm cells' },
  { id: 'airport', label: 'Airport Authority', short: 'Airport', focus: 'Storm cells · wind · visibility · lightning' },
  { id: 'rail', label: 'Railways', short: 'Rail', focus: 'Rail sections in storm path' },
  { id: 'public', label: 'Public', short: 'Public', focus: 'Simple warnings · safety instructions' },
];

export const responseTeams = [
  { id: 'T1', name: 'SDRF Team 3', base: 'Ramanagara', status: 'Standby', eta: '12 min' },
  { id: 'T2', name: 'NDRF 10th Bn (det.)', base: 'Bengaluru', status: 'Alerted', eta: '28 min' },
  { id: 'T3', name: 'Fire & Emergency', base: 'Kanakapura', status: 'Standby', eta: '9 min' },
  { id: 'T4', name: 'Quick Response Team', base: 'Magadi', status: 'Available', eta: '15 min' },
];

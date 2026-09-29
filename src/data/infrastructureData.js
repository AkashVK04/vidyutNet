// Mock critical infrastructure used by the stakeholder role views (approximate positions).

export const transmissionLines = [
  { id: 'TL1', name: '220 kV Bidadi – Ramanagara', kv: 220, path: [[12.797, 77.388], [12.76, 77.33], [12.722, 77.281]] },
  { id: 'TL2', name: '220 kV Ramanagara – Channapatna – Maddur', kv: 220, path: [[12.722, 77.281], [12.651, 77.209], [12.584, 77.044]] },
  { id: 'TL3', name: '400 kV Nelamangala – Somanahalli', kv: 400, path: [[13.097, 77.393], [12.99, 77.43], [12.86, 77.52], [12.79, 77.57]] },
  { id: 'TL4', name: '220 kV Kanakapura – Harohalli – Somanahalli', kv: 220, path: [[12.546, 77.419], [12.68, 77.474], [12.79, 77.57]] },
  { id: 'TL5', name: '220 kV Magadi – Nelamangala', kv: 220, path: [[12.957, 77.224], [13.03, 77.31], [13.097, 77.393]] },
  { id: 'TL6', name: '400 kV Nelamangala – Tumakuru', kv: 400, path: [[13.097, 77.393], [13.2, 77.25], [13.341, 77.101]] },
];

export const substations = [
  { id: 'SS1', name: 'Bidadi 220 kV', pos: [12.797, 77.388] },
  { id: 'SS2', name: 'Ramanagara 220 kV', pos: [12.722, 77.281] },
  { id: 'SS3', name: 'Nelamangala 400 kV', pos: [13.097, 77.393] },
  { id: 'SS4', name: 'Somanahalli 400 kV', pos: [12.79, 77.57] },
  { id: 'SS5', name: 'Kanakapura 66 kV', pos: [12.546, 77.419] },
  { id: 'SS6', name: 'Magadi 66 kV', pos: [12.957, 77.224] },
];

export const airports = [
  { id: 'VOBL', name: 'Kempegowda Intl. (VOBL)', pos: [13.1986, 77.7066], rings: [8, 20] },
  { id: 'VOBG', name: 'HAL Airport (VOBG)', pos: [12.95, 77.668], rings: [8] },
];

export const railLines = [
  {
    id: 'R1', name: 'Bengaluru – Mysuru', path: [
      [12.978, 77.57], [12.917, 77.483], [12.797, 77.388], [12.722, 77.281], [12.651, 77.209], [12.584, 77.044], [12.523, 76.897], [12.316, 76.645],
    ],
  },
  {
    id: 'R2', name: 'Bengaluru – Tumakuru', path: [
      [12.978, 77.57], [13.023, 77.55], [13.06, 77.47], [13.1, 77.39], [13.2, 77.25], [13.341, 77.101],
    ],
  },
];

export const railSections = [
  { id: 'RS1', name: 'Kengeri – Bidadi', line: 'Bengaluru – Mysuru', trains: 6, stations: [[12.917, 77.483], [12.797, 77.388]] },
  { id: 'RS2', name: 'Bidadi – Ramanagara', line: 'Bengaluru – Mysuru', trains: 5, stations: [[12.797, 77.388], [12.722, 77.281]] },
  { id: 'RS3', name: 'Ramanagara – Channapatna', line: 'Bengaluru – Mysuru', trains: 5, stations: [[12.722, 77.281], [12.651, 77.209]] },
  { id: 'RS4', name: 'Chikkabanavara – Nelamangala', line: 'Bengaluru – Tumakuru', trains: 3, stations: [[13.06, 77.47], [13.1, 77.39]] },
  { id: 'RS5', name: 'Nelamangala – Dobbaspet', line: 'Bengaluru – Tumakuru', trains: 3, stations: [[13.1, 77.39], [13.2, 77.25]] },
];

export const airportObs = {
  station: 'VOBL',
  windDir: 230, windSpeed: 14, gust: 26, visibility: 6.0, ceiling: 2500, qnh: 1009,
  runways: ['09L/27R', '09R/27L'],
};

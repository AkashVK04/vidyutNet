// Mock early-warning alerts (synthetic demonstration data — no real alerts are issued).

export const HAZARD_TYPES = ['Thunderstorm', 'Lightning', 'Heavy Rain', 'Severe Weather'];
export const SEVERITIES = ['MODERATE', 'HIGH', 'CRITICAL'];
export const LEAD_TIMES = [15, 30, 45, 60];
export const TARGET_GROUPS = ['DDMA', 'Village', 'Public', 'Utilities', 'Airports', 'Railways'];

export const ALERT_LOCATIONS = [
  { name: 'Ramanagara District', center: [12.74, 77.3], radiusKm: 16 },
  { name: 'Kanakapura Taluk', center: [12.56, 77.42], radiusKm: 13 },
  { name: 'Magadi Taluk', center: [12.96, 77.23], radiusKm: 12 },
  { name: 'Bengaluru Rural', center: [13.12, 77.45], radiusKm: 18 },
  { name: 'Bengaluru Urban (South-West)', center: [12.91, 77.49], radiusKm: 11 },
  { name: 'Tumakuru District', center: [13.3, 77.02], radiusKm: 15 },
  { name: 'Chikkaballapur District', center: [13.44, 77.66], radiusKm: 14 },
  { name: 'Mandya District', center: [12.56, 77.0], radiusKm: 14 },
];

const COMMON_ACTIONS = {
  thunderstorm: [
    'Move people indoors',
    'Suspend outdoor activities',
    'Warn schools and public facilities',
    'Notify emergency response teams',
    'Protect power infrastructure',
  ],
  lightning: [
    'Move people indoors; avoid open fields and tall trees',
    'Halt agricultural field work and grazing',
    'Warn schools to keep students indoors',
    'Alert power utility line crews',
  ],
  rain: [
    'Clear storm-water drains in low-lying wards',
    'Pre-position pumps at known flooding underpasses',
    'Advise commuters to avoid underpasses',
    'Notify traffic police and BBMP control room',
  ],
};

export const initialAlerts = [
  {
    id: 'VN-0929-001', severity: 'CRITICAL', hazard: 'Thunderstorm', title: 'Severe Thunderstorm Warning',
    location: 'Ramanagara District', center: [12.74, 77.3], radiusKm: 16,
    summary: 'Lightning activity rapidly increasing. Cell KAR-042 intensifying (52 dBZ) and moving NE at 24 km/h.',
    onset: '10–15 minutes', issued: '09:42', expiry: '10:45', confidence: 91, population: 18400, lightningProb: 87,
    villages: ['Ramanagara', 'Channapatna', 'Bidadi', 'Kanakapura', 'Harohalli'],
    actions: COMMON_ACTIONS.thunderstorm, targets: ['DDMA', 'Village', 'Public', 'Utilities'], cellId: 'KAR-042', status: 'active',
  },
  {
    id: 'VN-0929-002', severity: 'CRITICAL', hazard: 'Lightning', title: 'Extreme Lightning Warning',
    location: 'Kanakapura Taluk', center: [12.56, 77.42], radiusKm: 13,
    summary: 'Flash density exceeding 6 strikes/km²/h. Cloud-to-ground fraction increasing.',
    onset: '15–20 minutes', issued: '09:41', expiry: '10:40', confidence: 88, population: 12600, lightningProb: 84,
    villages: ['Kanakapura', 'Harohalli', 'Sathanur', 'Kodihalli'],
    actions: COMMON_ACTIONS.lightning, targets: ['DDMA', 'Village', 'Public'], cellId: 'KAR-038', status: 'active',
  },
  {
    id: 'VN-0929-003', severity: 'HIGH', hazard: 'Lightning', title: 'Lightning Warning',
    location: 'Bengaluru Rural', center: [13.12, 77.45], radiusKm: 18,
    summary: 'Storm cell KAR-045 tracking NE from Magadi toward Nelamangala.',
    onset: '20 minutes', issued: '09:40', expiry: '11:00', confidence: 85, population: 9800, lightningProb: 78,
    villages: ['Nelamangala', 'Dobbaspet', 'Doddaballapur'],
    actions: COMMON_ACTIONS.lightning, targets: ['DDMA', 'Utilities', 'Railways'], cellId: 'KAR-045', status: 'active',
  },
  {
    id: 'VN-0929-004', severity: 'HIGH', hazard: 'Heavy Rain', title: 'Intense Rainfall Warning',
    location: 'Bengaluru Urban (South-West)', center: [12.91, 77.49], radiusKm: 11,
    summary: 'Rain rates of 40–60 mm/h expected for 20–30 minutes. Urban flooding risk at underpasses.',
    onset: '30 minutes', issued: '09:39', expiry: '11:10', confidence: 83, population: 42000, lightningProb: 70,
    villages: ['Kengeri', 'Rajarajeshwari Nagar', 'Uttarahalli'],
    actions: COMMON_ACTIONS.rain, targets: ['DDMA', 'Public'], cellId: 'KAR-042', status: 'active',
  },
  {
    id: 'VN-0929-005', severity: 'HIGH', hazard: 'Thunderstorm', title: 'Thunderstorm Warning',
    location: 'Magadi Taluk', center: [12.96, 77.23], radiusKm: 12,
    summary: 'Developing cell KAR-045 (44 dBZ) with rapid vertical growth. Gusts up to 55 km/h.',
    onset: '30 minutes', issued: '09:38', expiry: '10:50', confidence: 82, population: 6150, lightningProb: 62,
    villages: ['Magadi', 'Kudur', 'Solur'],
    actions: COMMON_ACTIONS.thunderstorm, targets: ['DDMA', 'Village'], cellId: 'KAR-045', status: 'active',
  },
  {
    id: 'VN-0929-006', severity: 'MODERATE', hazard: 'Thunderstorm', title: 'Thunderstorm Watch',
    location: 'Tumakuru District', center: [13.3, 77.02], radiusKm: 15,
    summary: 'Moderate convection near Kunigal. Monitor for intensification.',
    onset: '35–45 minutes', issued: '09:36', expiry: '11:00', confidence: 78, population: 5200, lightningProb: 48,
    villages: ['Kunigal', 'Huliyurdurga'],
    actions: ['Monitor nowcast updates', 'Alert taluk-level officers', 'Advise farmers to plan shelter'], targets: ['DDMA'], cellId: 'KAR-031', status: 'active',
  },
  {
    id: 'VN-0929-007', severity: 'MODERATE', hazard: 'Lightning', title: 'Lightning Advisory',
    location: 'Chikkaballapur District', center: [13.44, 77.66], radiusKm: 14,
    summary: 'Isolated lightning possible later in the hour as cell KAR-029 develops.',
    onset: '50 minutes', issued: '09:35', expiry: '11:20', confidence: 74, population: 3100, lightningProb: 24,
    villages: ['Gauribidanur', 'Manchenahalli'],
    actions: ['Monitor nowcast updates', 'Advise outdoor workers'], targets: ['DDMA', 'Utilities'], cellId: 'KAR-029', status: 'active',
  },
];

// Alerts injected automatically by Simulation Mode / scenario.
export const simulatedAlertPool = [
  {
    severity: 'HIGH', hazard: 'Lightning', title: 'Lightning Warning', location: 'Bengaluru Urban (South-West)',
    center: [12.91, 77.49], radiusKm: 11, summary: 'New lightning cluster detected near Kengeri.',
    onset: '15 minutes', confidence: 84, population: 21000, lightningProb: 79,
    villages: ['Kengeri', 'Bidadi'], actions: COMMON_ACTIONS.lightning, targets: ['DDMA', 'Public'], cellId: 'KAR-042',
  },
  {
    severity: 'CRITICAL', hazard: 'Severe Weather', title: 'Severe Weather Warning', location: 'Bengaluru Rural',
    center: [13.12, 77.45], radiusKm: 18, summary: 'Cell KAR-045 core above 55 dBZ; damaging gusts possible.',
    onset: '10 minutes', confidence: 89, population: 14200, lightningProb: 88,
    villages: ['Nelamangala', 'Doddaballapur'], actions: COMMON_ACTIONS.thunderstorm, targets: ['DDMA', 'Utilities', 'Railways'], cellId: 'KAR-045',
  },
  {
    severity: 'MODERATE', hazard: 'Heavy Rain', title: 'Heavy Rain Advisory', location: 'Mandya District',
    center: [12.56, 77.0], radiusKm: 14, summary: 'Moderate to heavy showers expected near Maddur.',
    onset: '25 minutes', confidence: 76, population: 4800, lightningProb: 41,
    villages: ['Maddur'], actions: COMMON_ACTIONS.rain, targets: ['DDMA'], cellId: 'KAR-047',
  },
];

export const disseminationChannels = [
  { id: 'cap', name: 'CAP feed (Common Alerting Protocol)', status: 'Simulated' },
  { id: 'sms', name: 'Cell broadcast / SMS gateway', status: 'Simulated' },
  { id: 'ivr', name: 'IVR voice call (Kannada)', status: 'Simulated' },
  { id: 'app', name: 'Mobile app push', status: 'Simulated' },
  { id: 'siren', name: 'Village siren / PA system', status: 'Simulated' },
];

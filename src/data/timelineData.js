// Nowcast timeline — base analysis time is the 09:40 IST radar volume scan.
export const BASE_MINUTES = 9 * 60 + 40; // 09:40
export const STEP_MINUTES = 10;

export const timelineSteps = [
  { index: 0, label: 'NOW', time: '09:40', offset: 0 },
  { index: 1, label: '+10', time: '09:50', offset: 10 },
  { index: 2, label: '+20', time: '10:00', offset: 20 },
  { index: 3, label: '+30', time: '10:10', offset: 30 },
  { index: 4, label: '+40', time: '10:20', offset: 40 },
  { index: 5, label: '+50', time: '10:30', offset: 50 },
  { index: 6, label: '+60', time: '10:40', offset: 60 },
];

export const MAX_STEP = timelineSteps.length - 1;

// "Karnataka Severe Thunderstorm Event" demo scenario phases.
export const scenario = {
  id: 'KA-SEVERE-TS-01',
  name: 'Karnataka Severe Thunderstorm Event',
  description:
    'Convective cells initiate near Ramanagara, intensify rapidly and track north-east, extending risk toward Bengaluru Rural before weakening.',
  phases: [
    { step: 0, time: '09:40', title: 'Storm detected', detail: 'DWR identifies convective cell KAR-042 (52 dBZ) near Ramanagara.', tone: 'info' },
    { step: 1, time: '09:50', title: 'Lightning intensifies', detail: 'Flash rate up 19%. INSAT IR cloud tops cool to −61 °C.', tone: 'moderate' },
    { step: 2, time: '10:00', title: 'High risk', detail: 'Risk zones expand toward Bidadi and Kengeri. 52 villages exposed.', tone: 'high' },
    { step: 3, time: '10:10', title: 'Severe warning', detail: 'Severe thunderstorm warning issued for Ramanagara & Bengaluru Rural.', tone: 'critical' },
    { step: 4, time: '10:20', title: 'Peak lightning activity', detail: 'Peak flash density: 298 strikes / 30 min. Cell core 62 dBZ.', tone: 'critical' },
    { step: 5, time: '10:30', title: 'Storm weakening', detail: 'Core reflectivity dropping. Downgrade expected within 20 minutes.', tone: 'moderate' },
    { step: 6, time: '10:40', title: 'Moving out', detail: 'Residual activity over Bengaluru Rural. Warnings being reviewed.', tone: 'info' },
  ],
};

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { initialAlerts, simulatedAlertPool } from '../data/alertsData.js';
import { initialNotifications } from '../data/systemData.js';
import { BASE_CLOCK, useSimulation } from '../hooks/useSimulation.js';
import { useTween } from '../hooks/useTween.js';
import { useToast } from './ToastContext.jsx';
import { hhmm, hhmmss } from '../utils/formatters.js';

const AppContext = createContext(null);
const TimeContext = createContext(0);

export const DEFAULT_LAYERS = {
  radar: true,
  satellite: true,
  lightning: true,
  risk: true,
  prediction: true,
  coverage: true,
  wind: false,
  rainfall: false,
};

let alertSeq = 8;

export function AppProvider({ children }) {
  const toast = useToast();
  const [timeStep, setTimeStep] = useState(0);
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [role, setRole] = useState('ddma');
  const [lang, setLang] = useState('en');
  const [demoMode, setDemoMode] = useState(false);
  const [scenarioRunning, setScenarioRunning] = useState(false);
  const [scenarioPhase, setScenarioPhase] = useState(-1);
  const [presentation, setPresentation] = useState(false);
  const [selectedCellId, setSelectedCellId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [activeAlertId, setActiveAlertId] = useState(null);
  const [createAlertOpen, setCreateAlertOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [mapFocus, setMapFocus] = useState(null);
  const [sim, setSim] = useState({ clockSec: BASE_CLOCK, dbzJitter: 0, riskJitter: 0, strikeExtra: 0, simT: 0, tick: 0, radarScan: BASE_CLOCK });

  const pushNotification = useCallback((n) => {
    setNotifications((list) => [{ id: `n${Date.now()}${Math.random()}`, read: false, ...n }, ...list].slice(0, 30));
  }, []);

  const clock = hhmm(sim.clockSec / 60);

  const addAlert = useCallback(
    (a) => {
      alertSeq += 1;
      const alert = {
        id: `VN-0929-${String(alertSeq).padStart(3, '0')}`,
        issued: hhmm(sim.clockSec / 60),
        expiry: hhmm(sim.clockSec / 60 + 60),
        status: 'active',
        ...a,
      };
      setAlerts((list) => [alert, ...list]);
      return alert;
    },
    [sim.clockSec],
  );

  const onPhase = useCallback(
    (phase) => {
      if (!phase) {
        toast('Scenario complete', 'success', 'Karnataka Severe Thunderstorm Event — replay finished');
        setScenarioPhase(-1);
        return;
      }
      const type = phase.tone === 'critical' ? 'critical' : phase.tone === 'info' ? 'info' : 'warning';
      toast(`${phase.time} IST — ${phase.title}`, type, phase.detail);
      pushNotification({ time: phase.time, title: phase.title, detail: phase.detail, type: phase.tone === 'critical' ? 'critical' : 'warning' });
      if (phase.step === 3) {
        const a = addAlert({ ...simulatedAlertPool[1], issued: phase.time, simulated: true });
        setActiveAlertId(null);
        pushNotification({ time: phase.time, title: `${a.title} issued`, detail: a.location, type: 'critical' });
      }
    },
    [toast, pushNotification, addAlert],
  );

  const onSimEvent = useCallback(
    (k) => {
      const t = hhmm(sim.clockSec / 60);
      const events = [
        { title: 'Radar volume scan ingested', detail: 'DWR Bengaluru · Z / ZDR / KDP', type: 'ok' },
        { title: 'Lightning cluster intensified', detail: `Flash rate +${8 + (k % 9)}% near Ramanagara`, type: 'warning' },
        { title: 'Nowcast refreshed', detail: 'AI inference completed in 12 s', type: 'info' },
      ];
      const ev = events[(k / 6) % events.length];
      pushNotification({ time: t, ...ev });
      if (k % 18 === 0) {
        const pool = simulatedAlertPool[(k / 18) % simulatedAlertPool.length];
        const a = addAlert({ ...pool, simulated: true });
        toast('New simulated alert', a.severity === 'CRITICAL' ? 'critical' : 'warning', `${a.title} — ${a.location}`);
      }
    },
    [sim.clockSec, pushNotification, addAlert, toast],
  );

  useSimulation({ demoMode, scenarioRunning, setSim, setTimeStep, setScenarioRunning, setScenarioPhase, onPhase, onSimEvent });

  const toggleLayer = useCallback(
    (key, label) => {
      const on = !layers[key];
      setLayers((l) => ({ ...l, [key]: on }));
      toast(on ? 'Layer enabled' : 'Layer hidden', 'info', label);
    },
    [layers, toast],
  );

  const startScenario = useCallback(() => {
    setScenarioRunning(false);
    setTimeout(() => {
      setDemoMode(true);
      setScenarioRunning(true);
      toast('Simulation started', 'info', 'Karnataka Severe Thunderstorm Event');
    }, 30);
  }, [toast]);

  const stopScenario = useCallback(() => {
    setScenarioRunning(false);
    setScenarioPhase(-1);
    toast('Scenario stopped', 'info');
  }, [toast]);

  const toggleDemo = useCallback(() => {
    const next = !demoMode;
    setDemoMode(next);
    if (!next) setScenarioRunning(false);
    toast(next ? 'Simulation started' : 'Simulation stopped', 'info', next ? 'Using synthetic demonstration data' : 'Returned to static demonstration snapshot');
  }, [demoMode, toast]);

  const acknowledgeAlert = useCallback(
    (id) => {
      setAlerts((list) => list.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a)));
      toast('Warning acknowledged', 'success', id);
    },
    [toast],
  );

  const focusMap = useCallback((center, zoom = 11) => setMapFocus({ center, zoom, key: Date.now() }), []);

  const value = useMemo(
    () => ({
      timeStep, setTimeStep, layers, setLayers, toggleLayer, role, setRole, lang, setLang,
      demoMode, setDemoMode, toggleDemo, scenarioRunning, scenarioPhase, startScenario, stopScenario,
      presentation, setPresentation, selectedCellId, setSelectedCellId, selectedDistrictId, setSelectedDistrictId,
      activeAlertId, setActiveAlertId, createAlertOpen, setCreateAlertOpen, settingsOpen, setSettingsOpen,
      alerts, setAlerts, addAlert, acknowledgeAlert, notifications, setNotifications, pushNotification,
      mapFocus, focusMap, sim, clock, clockFull: hhmmss(sim.clockSec), toast,
    }),
    [timeStep, layers, toggleLayer, role, lang, demoMode, toggleDemo, scenarioRunning, scenarioPhase, startScenario, stopScenario,
      presentation, selectedCellId, selectedDistrictId, activeAlertId, createAlertOpen, settingsOpen, alerts, addAlert, acknowledgeAlert,
      notifications, pushNotification, mapFocus, focusMap, sim, clock, toast],
  );

  // Animated (fractional) timeline position used by map overlays for smooth storm motion.
  const animatedT = useTween(timeStep + (demoMode ? sim.simT : 0), 900);

  return (
    <AppContext.Provider value={value}>
      <TimeContext.Provider value={animatedT}>{children}</TimeContext.Provider>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
/** Fractional, animated timeline position (0…6) */
export const useAnimatedT = () => useContext(TimeContext);

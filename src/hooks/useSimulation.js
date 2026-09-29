import { useEffect, useRef } from 'react';
import { scenario, MAX_STEP, BASE_MINUTES } from '../data/timelineData.js';

const BASE_CLOCK = BASE_MINUTES * 60 + 2 * 60 + 10; // 09:42:10

/**
 * Drives Simulation Mode (synthetic live updates) and the scripted
 * "Karnataka Severe Thunderstorm Event" scenario.
 */
export function useSimulation({ demoMode, scenarioRunning, setSim, setTimeStep, setScenarioRunning, setScenarioPhase, onPhase, onSimEvent }) {
  const tickRef = useRef(0);
  const onPhaseRef = useRef(onPhase);
  const onSimEventRef = useRef(onSimEvent);
  onPhaseRef.current = onPhase;
  onSimEventRef.current = onSimEvent;

  // Live clock + synthetic jitter while Simulation Mode is enabled.
  useEffect(() => {
    if (!demoMode) {
      setSim((s) => ({ ...s, dbzJitter: 0, riskJitter: 0, strikeExtra: 0, simT: 0 }));
      return undefined;
    }
    const clock = setInterval(() => setSim((s) => ({ ...s, clockSec: s.clockSec + 1 })), 1000);
    const jitter = setInterval(() => {
      tickRef.current += 1;
      const k = tickRef.current;
      setSim((s) => ({
        ...s,
        tick: k,
        dbzJitter: Math.round((Math.sin(k * 1.3) * 1.6 + (Math.random() - 0.5) * 1.4) * 10) / 10,
        riskJitter: Math.round(Math.sin(k * 0.9) * 3 + (Math.random() - 0.5) * 2),
        strikeExtra: Math.max(0, Math.min(40, s.strikeExtra + Math.round(Math.random() * 7 - 2))),
        simT: 0.35 * (1 - Math.cos(k * 0.35)),
        radarScan: s.clockSec,
      }));
      if (k % 6 === 0) onSimEventRef.current?.(k);
    }, 3000);
    return () => {
      clearInterval(clock);
      clearInterval(jitter);
    };
  }, [demoMode, setSim]);

  // Scripted scenario: advance one timeline step every ~4.5 seconds.
  useEffect(() => {
    if (!scenarioRunning) return undefined;
    let step = 0;
    setTimeStep(0);
    setScenarioPhase(0);
    setSim((s) => ({ ...s, clockSec: BASE_CLOCK }));
    onPhaseRef.current?.(scenario.phases[0]);
    const id = setInterval(() => {
      step += 1;
      if (step > MAX_STEP) {
        clearInterval(id);
        setScenarioRunning(false);
        onPhaseRef.current?.(null);
        return;
      }
      setTimeStep(step);
      setScenarioPhase(step);
      setSim((s) => ({ ...s, clockSec: BASE_CLOCK + step * 600 }));
      onPhaseRef.current?.(scenario.phases[step]);
    }, 4500);
    return () => clearInterval(id);
  }, [scenarioRunning, setTimeStep, setScenarioRunning, setScenarioPhase, setSim]);
}

export { BASE_CLOCK };

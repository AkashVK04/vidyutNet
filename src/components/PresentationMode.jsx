import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Play, Square, Siren } from 'lucide-react';
import { useApp, useAnimatedT } from '../context/AppContext.jsx';
import { useStormCells } from '../hooks/useWeatherLayers.js';
import { PRIMARY_CELL_ID } from '../data/stormCellsData.js';
import { scenario, timelineSteps } from '../data/timelineData.js';
import { SEVERITY } from '../utils/riskCalculator.js';
import WeatherMap from './WeatherMap.jsx';
import { MapLayerControl, MapLegend } from './MapControls.jsx';
import Timeline from './Timeline.jsx';
import { useKpis } from './KPIGrid.jsx';
import { StormCellDetail } from './StormCellPanel.jsx';
import { Logo } from './Header.jsx';
import { SeverityBadge, StatusDot } from './ui.jsx';
import { cx } from '../utils/formatters.js';

const PHASE_TONE = {
  info: 'border-cyan-400/50 text-cyan-100 bg-cyan-500/15',
  moderate: 'border-yellow-400/50 text-yellow-100 bg-yellow-500/15',
  high: 'border-orange-400/60 text-orange-100 bg-orange-500/20',
  critical: 'border-red-500/60 text-red-100 bg-red-600/25',
};

export default function PresentationMode() {
  const app = useApp();
  const { setPresentation, scenarioRunning, startScenario, stopScenario, timeStep, alerts, clock, selectedCellId, setActiveAlertId, sim } = app;
  const t = useAnimatedT();
  const cells = useStormCells(t, sim.dbzJitter);
  const cell = cells.find((c) => c.id === (selectedCellId || PRIMARY_CELL_ID));
  const kpis = useKpis().slice(0, 4);
  const phase = scenario.phases[timeStep];
  const active = alerts.filter((a) => a.status === 'active').sort((a, b) => SEVERITY[b.severity].rank - SEVERITY[a.severity].rank).slice(0, 4);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setPresentation(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setPresentation]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1800] flex flex-col bg-ink-950">
      <div className="flex items-center gap-4 border-b border-line px-5 py-2.5">
        <Logo sub="Hyperlocal Nowcasting & Early Warning · SIH26072" />
        <div className="ml-4 hidden items-center gap-2 lg:flex">
          <span className="kicker text-amber-300/80">Scenario</span>
          <span className="text-[14px] font-semibold text-white">{scenario.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex h-9 items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/[0.07] px-3">
            <StatusDot />
            <span className="font-mono text-[12px] font-bold tracking-wider text-emerald-300">LIVE</span>
            <span className="num text-[14px] text-slate-100">{clock} IST</span>
          </div>
          {scenarioRunning ? (
            <button onClick={stopScenario} className="btn-amber h-9"><Square size={14} /> Stop</button>
          ) : (
            <button onClick={startScenario} className="btn-amber h-9"><Play size={14} /> Start Scenario</button>
          )}
          <button onClick={() => setPresentation(false)} className="btn-ghost h-9" title="Exit presentation (Esc)"><X size={15} /> Exit</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 px-5 pt-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="panel flex items-center gap-4 px-4 py-3">
            <k.icon size={26} className="text-cyan-300" />
            <div>
              <p className="kicker">{k.label}</p>
              <motion.p key={String(k.value)} initial={{ opacity: 0.3, y: 4 }} animate={{ opacity: 1, y: 0 }} className="num text-[34px] font-semibold leading-none text-white">{k.value}</motion.p>
              <p className={cx('mt-1 text-[12px]', k.subTone || 'text-slate-500')}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative m-5 mt-3 min-h-0 flex-1 overflow-hidden rounded-lg border border-line">
        <WeatherMap zoom={9.75} center={[12.9, 77.4]}>
          <AnimatePresence mode="wait">
            {phase && (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cx('absolute left-1/2 top-4 z-[800] -translate-x-1/2 rounded-lg border px-5 py-2.5 text-center shadow-2xl backdrop-blur', PHASE_TONE[phase.tone])}
              >
                <p className="num text-[11px] opacity-80">{phase.time} IST · T+{timelineSteps[phase.step].offset} min</p>
                <p className="text-[20px] font-bold tracking-tight">{phase.title}</p>
                <p className="max-w-[520px] text-[12.5px] opacity-80">{phase.detail}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {cell && (
            <div className="panel-glass absolute left-4 top-4 z-[800] hidden w-[300px] p-3.5 md:block">
              <StormCellDetail cell={cell} compact />
            </div>
          )}

          <div className="absolute right-4 top-4 z-[800] hidden w-[300px] space-y-2 lg:block">
            <div className="panel-glass p-3">
              <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white"><Siren size={15} className="text-red-300" /> Active Warnings</p>
              <ul className="space-y-1.5">
                {active.map((a) => (
                  <li key={a.id}>
                    <button onClick={() => setActiveAlertId(a.id)} className="relative w-full overflow-hidden rounded border border-line bg-white/[0.02] py-1.5 pl-3 pr-2 text-left hover:bg-white/[0.05]">
                      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: SEVERITY[a.severity].color }} />
                      <div className="flex items-center justify-between"><SeverityBadge severity={a.severity} /><span className="num text-[10.5px] text-slate-400">{a.onset}</span></div>
                      <p className="mt-0.5 truncate text-[12.5px] font-semibold text-slate-100">{a.title}</p>
                      <p className="truncate text-[11px] text-slate-400">{a.location}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <MapLayerControl defaultOpen={false} className="!w-full" />
          </div>

          <MapLegend className="absolute bottom-[136px] left-4 z-[800] hidden md:block" />
          <Timeline large className="absolute bottom-4 left-4 right-4 z-[800] md:right-16" />
        </WeatherMap>
      </div>
    </motion.div>
  );
}

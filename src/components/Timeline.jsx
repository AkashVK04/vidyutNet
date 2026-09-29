import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { timelineSteps, MAX_STEP, scenario } from '../data/timelineData.js';
import { cx } from '../utils/formatters.js';
import { Tooltip } from './ui.jsx';

const toneColor = { info: 'bg-cyan-400', moderate: 'bg-yellow-400', high: 'bg-orange-400', critical: 'bg-red-500' };

export default function Timeline({ className, large = false }) {
  const { timeStep, setTimeStep, scenarioRunning } = useApp();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || scenarioRunning) return undefined;
    const id = setInterval(() => setTimeStep((s) => (s >= MAX_STEP ? 0 : s + 1)), 1800);
    return () => clearInterval(id);
  }, [playing, scenarioRunning, setTimeStep]);

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') setTimeStep((s) => Math.min(MAX_STEP, s + 1));
      if (e.key === 'ArrowLeft') setTimeStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setTimeStep]);

  const phase = scenario.phases[timeStep];
  const pct = (timeStep / MAX_STEP) * 100;

  return (
    <div className={cx('panel-glass px-3 pb-2.5 pt-2', className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Clock size={13} className="shrink-0 text-cyan-300" />
          <span className="truncate text-[12px] font-semibold text-slate-100">Nowcast Timeline — 60 Minutes</span>
          <span className="num hidden rounded bg-cyan-400/10 px-1.5 py-0.5 text-[10px] text-cyan-200 sm:inline">
            Valid {timelineSteps[timeStep].time} IST
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip label="Step back (←)" side="top">
            <button className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white" onClick={() => setTimeStep((s) => Math.max(0, s - 1))} aria-label="Step back">
              <SkipBack size={14} />
            </button>
          </Tooltip>
          <Tooltip label={playing ? 'Pause animation' : 'Animate forecast'} side="top">
            <button
              className={cx('rounded border p-1', playing ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-200' : 'border-line text-slate-300 hover:text-white')}
              onClick={() => setPlaying((p) => !p)}
              disabled={scenarioRunning}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </Tooltip>
          <Tooltip label="Step forward (→)" side="top">
            <button className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white" onClick={() => setTimeStep((s) => Math.min(MAX_STEP, s + 1))} aria-label="Step forward">
              <SkipForward size={14} />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="relative px-2">
        <div className="absolute left-2 right-2 top-[9px] h-[3px] rounded-full bg-white/[0.07]" />
        <motion.div className="absolute left-2 top-[9px] h-[3px] rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-red-500" animate={{ width: `calc(${pct}% - ${(pct / 100) * 16}px)` }} transition={{ duration: 0.5 }} />
        <div className="relative flex justify-between">
          {timelineSteps.map((s) => {
            const active = s.index === timeStep;
            const past = s.index < timeStep;
            return (
              <button key={s.index} onClick={() => setTimeStep(s.index)} className="group -mx-6 flex w-12 flex-col items-center" aria-label={`Forecast ${s.time}`} aria-current={active}>
                <span
                  className={cx(
                    'grid h-[21px] w-[21px] place-items-center rounded-full border-2 transition-all',
                    active ? 'scale-110 border-cyan-300 bg-ink-900 shadow-[0_0_0_4px_rgba(34,211,238,0.18)]' : past ? 'border-cyan-500/60 bg-ink-800' : 'border-slate-600 bg-ink-850 group-hover:border-slate-400',
                  )}
                >
                  <span className={cx('h-[7px] w-[7px] rounded-full', active ? 'bg-cyan-300' : past ? 'bg-cyan-600' : 'bg-transparent')} />
                </span>
                <span className={cx('num mt-1 whitespace-nowrap text-[10.5px]', active ? 'font-semibold text-cyan-200' : 'text-slate-400')}>{s.index === 0 ? 'NOW' : s.time}</span>
                {large && <span className="whitespace-nowrap text-[9.5px] text-slate-500">{s.index === 0 ? s.time : s.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {phase && (
        <div className="mt-2 flex items-center gap-2 border-t border-line pt-2 text-[11px]">
          <span className={cx('h-1.5 w-1.5 shrink-0 rounded-full', toneColor[phase.tone])} />
          <span className="num shrink-0 text-slate-400">{phase.time}</span>
          <span className="shrink-0 font-semibold text-slate-100">{phase.title}</span>
          <span className="hidden truncate text-slate-400 md:inline">— {phase.detail}</span>
        </div>
      )}
    </div>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { X, Crosshair, ArrowUpRight, CloudLightning, Navigation, ChevronRight } from 'lucide-react';
import { useApp, useAnimatedT } from '../context/AppContext.jsx';
import { useStormCells } from '../hooks/useWeatherLayers.js';
import { timelineSteps } from '../data/timelineData.js';
import { dbzToIntensity } from '../utils/riskCalculator.js';
import { compass } from '../utils/geo.js';
import { cx } from '../utils/formatters.js';
import { Panel, ProbBar } from './ui.jsx';
import { axisProps, tooltipProps } from '../utils/chartTheme.js';

function Field({ label, value, accent }) {
  return (
    <div className="border-b border-line/70 py-1.5">
      <p className="kicker !text-[9.5px]">{label}</p>
      <p className={cx('num mt-0.5 text-[13px] font-semibold', accent || 'text-slate-100')}>{value}</p>
    </div>
  );
}

export function StormCellDetail({ cell, onClose, compact = false }) {
  const navigate = useNavigate();
  const { focusMap, toast, timeStep } = useApp();
  const intensity = dbzToIntensity(cell.dbz);
  const series = cell.dbzProfile.map((v, i) => ({ t: timelineSteps[i].time, dbz: v }));

  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="kicker text-cyan-300/80">Storm Cell</p>
          <h3 className="num text-lg font-semibold text-white">#{cell.id}</h3>
          <p className="text-[12px] text-slate-400">{cell.district}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="chip border-transparent" style={{ background: `${intensity.color}22`, color: intensity.color }}>
            {intensity.label}
          </span>
          {onClose && (
            <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close storm cell panel">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-4">
        <Field label="Current reflectivity" value={`${Math.round(cell.dbz)} dBZ`} accent="text-orange-300" />
        <Field label="Movement" value={`${compass(cell.heading)} ${cell.speedKmh} km/h`} />
        <Field label="Direction" value={`${cell.heading}°`} />
        <Field label="Affected area" value={`${cell.areaKm2.toFixed(1)} km²`} />
        <Field label="Estimated impact" value={cell.impact} />
        <Field label="Forecast confidence" value={`${Math.round(cell.confidence)}%`} accent="text-cyan-200" />
      </div>

      <div className="mt-2.5 space-y-2">
        <div>
          <div className="mb-1 flex justify-between text-[11.5px]"><span className="text-slate-400">Lightning probability</span><span className="num font-semibold text-amber-300">{Math.round(cell.lightningProb)}%</span></div>
          <ProbBar value={cell.lightningProb} color="#f59e0b" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[11.5px]"><span className="text-slate-400">Severe weather probability</span><span className="num font-semibold text-red-300">{Math.round(cell.severeProb)}%</span></div>
          <ProbBar value={cell.severeProb} color="#ef4444" />
        </div>
      </div>

      {!compact && (
        <div className="mt-3">
          <p className="kicker mb-1 !text-[9.5px]">Reflectivity forecast · 0–60 min (dBZ)</p>
          <div className="h-[84px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id={`g-${cell.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" {...axisProps} tick={{ ...axisProps.tick, fontSize: 9 }} interval={1} />
                <YAxis {...axisProps} domain={[20, 70]} ticks={[30, 50, 70]} tick={{ ...axisProps.tick, fontSize: 9 }} />
                <ReferenceLine x={timelineSteps[timeStep].time} stroke="#22d3ee" strokeDasharray="3 3" />
                <RTooltip {...tooltipProps} formatter={(v) => [`${v} dBZ`, 'Reflectivity']} />
                <Area type="monotone" dataKey="dbz" stroke="#f97316" strokeWidth={2} fill={`url(#g-${cell.id})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          className="btn-primary flex-1"
          onClick={() => {
            navigate(`/app/nowcast?cell=${cell.id}`);
            toast('Opening detailed forecast', 'info', `Cell ${cell.id}`);
          }}
        >
          View Detailed Forecast <ArrowUpRight size={14} />
        </button>
        <button className="btn-ghost" onClick={() => focusMap(cell.pos, 10.5)} title="Center map on cell" aria-label="Center map on cell">
          <Crosshair size={14} />
        </button>
      </div>
    </div>
  );
}

export default function StormCellPanel({ className }) {
  const { selectedCellId, setSelectedCellId, sim, toast } = useApp();
  const t = useAnimatedT();
  const cells = useStormCells(t, sim.dbzJitter);
  const selected = cells.find((c) => c.id === selectedCellId);
  const sorted = [...cells].sort((a, b) => b.dbz - a.dbz);

  return (
    <Panel
      className={className}
      title={selected ? 'Storm Cell Detail' : 'Active Storm Cells'}
      icon={CloudLightning}
      actions={!selected && <span className="num text-[11px] text-slate-500">{cells.length} tracked</span>}
    >
      <AnimatePresence mode="wait" initial={false}>
        {selected ? (
          <motion.div key="detail" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}>
            <StormCellDetail cell={selected} onClose={() => setSelectedCellId(null)} />
          </motion.div>
        ) : (
          <motion.ul key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="-mx-1 space-y-0.5">
            {sorted.map((c) => {
              const int = dbzToIntensity(c.dbz);
              return (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setSelectedCellId(c.id);
                      toast('Storm cell selected', 'info', `${c.id} · ${c.locality}`);
                    }}
                    className="group flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left hover:bg-white/[0.04]"
                  >
                    <span className="h-7 w-1 rounded-full" style={{ background: int.color }} />
                    <span className="min-w-0 flex-1">
                      <span className="num block text-[12.5px] font-semibold text-slate-100">{c.id}</span>
                      <span className="block truncate text-[11px] text-slate-500">{c.locality} · <Navigation size={9} className="inline" style={{ transform: `rotate(${c.heading}deg)` }} /> {compass(c.heading)} {c.speedKmh} km/h</span>
                    </span>
                    <span className="text-right">
                      <span className="num block text-[12.5px] font-semibold" style={{ color: int.color }}>{Math.round(c.dbz)} dBZ</span>
                      <span className="num block text-[10.5px] text-slate-500">⚡ {Math.round(c.lightningProb)}%</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-300" />
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </Panel>
  );
}

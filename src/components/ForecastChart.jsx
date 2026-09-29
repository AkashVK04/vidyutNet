import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { CalendarClock } from 'lucide-react';
import { threeHourForecast } from '../data/forecastData.js';
import { scoreToLevel } from '../utils/riskCalculator.js';
import { axisProps, gridProps, tooltipProps, SERIES } from '../utils/chartTheme.js';
import { LevelBadge, Panel } from './ui.jsx';

// Small multiples — one measure per chart (no dual axes).
const METRICS = [
  { key: 'intensity', label: 'Storm intensity', unit: 'dBZ', kind: 'line', color: SERIES[0], domain: [20, 70] },
  { key: 'lightning', label: 'Lightning density', unit: 'strikes / 30 min', kind: 'bar', color: SERIES[1] },
  { key: 'rainfall', label: 'Rainfall intensity', unit: 'mm/h', kind: 'bar', color: SERIES[0] },
  { key: 'risk', label: 'Risk level', unit: 'index / 100', kind: 'risk', domain: [0, 100] },
];

function Mini({ m }) {
  return (
    <div className="rounded-md border border-line bg-white/[0.015] p-2.5">
      <div className="mb-1 flex items-baseline justify-between">
        <p className="text-[12px] font-semibold text-slate-200">{m.label}</p>
        <p className="num text-[10px] text-slate-500">{m.unit}</p>
      </div>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          {m.kind === 'line' ? (
            <LineChart data={threeHourForecast} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...axisProps} tick={{ ...axisProps.tick, fontSize: 9 }} />
              <YAxis {...axisProps} domain={m.domain} tick={{ ...axisProps.tick, fontSize: 9 }} />
              <Tooltip {...tooltipProps} formatter={(v) => [`${v} ${m.unit}`, m.label]} />
              <Line type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={2} dot={{ r: 3, fill: m.color, stroke: '#070e1d', strokeWidth: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
          ) : (
            <BarChart data={threeHourForecast} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="label" {...axisProps} tick={{ ...axisProps.tick, fontSize: 9 }} />
              <YAxis {...axisProps} domain={m.domain || [0, 'auto']} tick={{ ...axisProps.tick, fontSize: 9 }} />
              <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(148,178,222,0.06)' }} formatter={(v) => [`${v} ${m.unit}`, m.label]} />
              <Bar dataKey={m.key} radius={[4, 4, 0, 0]} maxBarSize={22}>
                {threeHourForecast.map((d) => (
                  <Cell key={d.label} fill={m.kind === 'risk' ? scoreToLevel(d.risk).color : m.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ForecastChart({ className }) {
  return (
    <Panel className={className} title="3-Hour Extended Forecast" kicker="Secondary product" icon={CalendarClock}
      actions={<span className="text-[10.5px] text-slate-500">Confidence decays with lead time</span>}>
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((m) => (
          <Mini key={m.key} m={m} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {threeHourForecast.map((d) => (
          <div key={d.label} className="rounded border border-line px-2 py-1.5 text-center">
            <p className="num text-[10.5px] font-semibold text-slate-300">{d.label}</p>
            <p className="num text-[10px] text-slate-500">{d.time}</p>
            <LevelBadge level={scoreToLevel(d.risk)} className="mt-1" />
            <p className="num mt-1 text-[10px] text-slate-500">conf. {d.confidence}%</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

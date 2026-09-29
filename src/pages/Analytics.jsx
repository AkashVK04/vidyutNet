import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FlaskConical, Grid2X2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { reflectivityForecast, lightningDensity, confidenceByLead, alertAccuracy, confusionMatrix, skillScores } from '../data/analyticsData.js';
import { districts } from '../data/districtsData.js';
import { scoreToLevel } from '../utils/riskCalculator.js';
import { axisProps, gridProps, tooltipProps, SERIES } from '../utils/chartTheme.js';
import { PageHeader, Panel, Skeleton } from '../components/ui.jsx';

function ChartPanel({ title, sub, children, loading }) {
  return (
    <Panel title={title} kicker={sub}>
      <div className="h-[210px]">{loading ? <Skeleton className="h-full w-full" /> : <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>}</div>
    </Panel>
  );
}

const legendProps = { iconType: 'plainline', iconSize: 14, wrapperStyle: { fontSize: 11, color: '#94a3b8' } };

export default function Analytics() {
  const { timeStep } = useApp();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(id);
  }, []);
  const s = skillScores();
  const riskData = districts.map((d) => ({ name: d.name.replace('Bengaluru', 'BLR'), score: d.risk[timeStep] })).sort((a, b) => b.score - a.score);
  const m = confusionMatrix;

  const tiles = [
    { k: 'Critical Success Index', v: s.csi.toFixed(2), sub: '60-minute lead time' },
    { k: 'Probability of Detection', v: s.pod.toFixed(2), sub: 'Lightning ≥1 stroke / 1 km' },
    { k: 'False Alarm Ratio', v: s.far.toFixed(2), sub: 'Lower is better' },
    { k: 'Frequency Bias', v: s.bias.toFixed(2), sub: '1.0 = unbiased' },
    { k: 'Lead Time', v: '60 min', sub: 'Operational horizon' },
  ];

  return (
    <div className="space-y-3">
      <PageHeader kicker="Verification" title="Analytics & Model Performance" subtitle="Forecast skill, alert accuracy and calibration" />

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/30 bg-amber-400/[0.07] px-4 py-2.5">
        <FlaskConical size={16} className="mt-0.5 shrink-0 text-amber-300" />
        <p className="text-[12.5px] text-amber-100/90">
          <b className="font-semibold text-amber-200">Prototype / Demonstration Metrics.</b> These values are illustrative and were generated for this demonstration. They are not live or independently verified measurements.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5">
        {tiles.map((t) => (
          <div key={t.k} className="panel px-3.5 py-3">
            <p className="kicker truncate">{t.k}</p>
            <p className="num mt-1 text-[28px] font-semibold leading-none text-white">{t.v}</p>
            <p className="mt-1 text-[11px] text-slate-500">{t.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ChartPanel title="Radar Reflectivity Forecast" sub="KAR-042 core · dBZ" loading={loading}>
          <LineChart data={reflectivityForecast} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="t" {...axisProps} interval={2} />
            <YAxis {...axisProps} domain={[15, 70]} />
            <Tooltip {...tooltipProps} />
            <Legend {...legendProps} />
            <ReferenceLine x="09:40" stroke="rgba(148,178,222,0.5)" strokeDasharray="3 3" label={{ value: 'NOW', fill: '#94a3b8', fontSize: 10, position: 'insideTopRight' }} />
            <Line dataKey="observed" name="Observed" stroke={SERIES[0]} strokeWidth={2} dot={false} connectNulls={false} />
            <Line dataKey="forecast" name="Forecast" stroke={SERIES[1]} strokeWidth={2} strokeDasharray="5 3" dot={false} />
          </LineChart>
        </ChartPanel>

        <ChartPanel title="Lightning Density" sub="Strikes / 10 min" loading={loading}>
          <AreaChart data={lightningDensity} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="t" {...axisProps} interval={2} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Legend {...legendProps} />
            <Area dataKey="observed" name="Observed" stroke={SERIES[0]} strokeWidth={2} fill={SERIES[0]} fillOpacity={0.15} />
            <Area dataKey="predicted" name="Predicted" stroke={SERIES[1]} strokeWidth={2} strokeDasharray="5 3" fill={SERIES[1]} fillOpacity={0.08} />
          </AreaChart>
        </ChartPanel>

        <ChartPanel title="Risk Score by District" sub={`Nowcast step ${timeStep === 0 ? 'NOW' : `+${timeStep * 10} min`}`} loading={loading}>
          <BarChart data={riskData} layout="vertical" margin={{ top: 4, right: 12, left: 16, bottom: 0 }}>
            <CartesianGrid {...gridProps} horizontal={false} vertical />
            <XAxis type="number" domain={[0, 100]} {...axisProps} />
            <YAxis type="category" dataKey="name" {...axisProps} width={86} tick={{ ...axisProps.tick, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10.5 }} />
            <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(148,178,222,0.06)' }} formatter={(v) => [`${v} / 100`, 'Risk score']} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={14}>
              {riskData.map((d) => <Cell key={d.name} fill={scoreToLevel(d.score).color} />)}
            </Bar>
          </BarChart>
        </ChartPanel>

        <ChartPanel title="Forecast Confidence" sub="By lead time (minutes)" loading={loading}>
          <LineChart data={confidenceByLead} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="lead" {...axisProps} />
            <YAxis {...axisProps} domain={[40, 100]} unit="%" />
            <Tooltip {...tooltipProps} formatter={(v) => [`${v}%`, 'Confidence']} labelFormatter={(l) => `Lead ${l} min`} />
            <ReferenceLine x="60" stroke="rgba(148,178,222,0.5)" strokeDasharray="3 3" />
            <Line dataKey="confidence" stroke={SERIES[0]} strokeWidth={2} dot={{ r: 3, fill: SERIES[0], stroke: '#070e1d', strokeWidth: 2 }} />
          </LineChart>
        </ChartPanel>

        <ChartPanel title="Alert Accuracy" sub="Weekly hit rate (%)" loading={loading}>
          <BarChart data={alertAccuracy} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="week" {...axisProps} />
            <YAxis {...axisProps} domain={[60, 100]} />
            <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(148,178,222,0.06)' }} formatter={(v) => [`${v}%`, 'Hit rate']} />
            <Bar dataKey="hit" fill={SERIES[0]} radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ChartPanel>

        <ChartPanel title="False Alarm Rate" sub="Weekly FAR (%)" loading={loading}>
          <LineChart data={alertAccuracy} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="week" {...axisProps} />
            <YAxis {...axisProps} domain={[15, 35]} />
            <Tooltip {...tooltipProps} formatter={(v) => [`${v}%`, 'False alarm rate']} />
            <Line dataKey="far" stroke={SERIES[1]} strokeWidth={2} dot={{ r: 3, fill: SERIES[1], stroke: '#070e1d', strokeWidth: 2 }} />
          </LineChart>
        </ChartPanel>
      </div>

      <div className="grid gap-3 lg:grid-cols-[420px_1fr]">
        <Panel title="Contingency Table" kicker="Lightning occurrence · 1 km · 60 min" icon={Grid2X2}>
          <div className="grid grid-cols-[auto_1fr_1fr] gap-1.5 text-center text-[12px]">
            <span />
            <span className="kicker !text-[9.5px]">Observed: YES</span>
            <span className="kicker !text-[9.5px]">Observed: NO</span>
            <span className="kicker flex items-center !text-[9.5px] [writing-mode:vertical-rl] rotate-180">Forecast: YES</span>
            <div className="rounded-md border border-emerald-400/30 bg-emerald-400/15 py-5"><p className="num text-2xl font-semibold text-emerald-200">{m.hits}</p><p className="text-[11px] text-emerald-300/80">Hits</p></div>
            <div className="rounded-md border border-orange-400/30 bg-orange-500/10 py-5"><p className="num text-2xl font-semibold text-orange-200">{m.falseAlarms}</p><p className="text-[11px] text-orange-300/80">False alarms</p></div>
            <span className="kicker flex items-center !text-[9.5px] [writing-mode:vertical-rl] rotate-180">Forecast: NO</span>
            <div className="rounded-md border border-red-400/30 bg-red-500/10 py-5"><p className="num text-2xl font-semibold text-red-200">{m.misses}</p><p className="text-[11px] text-red-300/80">Misses</p></div>
            <div className="rounded-md border border-line bg-white/[0.03] py-5"><p className="num text-2xl font-semibold text-slate-200">{m.correctNegatives.toLocaleString('en-IN')}</p><p className="text-[11px] text-slate-400">Correct negatives</p></div>
          </div>
          <p className="num mt-3 text-[11.5px] text-slate-400">CSI = H / (H + M + FA) = {m.hits} / {m.hits + m.misses + m.falseAlarms} = <b className="text-white">{s.csi.toFixed(2)}</b></p>
        </Panel>

        <ChartPanel title="Critical Success Index vs Lead Time" sub="Skill degrades beyond the 60-min nowcast window" loading={loading}>
          <AreaChart data={confidenceByLead} margin={{ top: 6, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="lead" {...axisProps} />
            <YAxis {...axisProps} domain={[0.3, 0.9]} />
            <Tooltip {...tooltipProps} formatter={(v) => [v.toFixed(2), 'CSI']} labelFormatter={(l) => `Lead ${l} min`} />
            <ReferenceLine x="60" stroke="#d97706" strokeDasharray="3 3" label={{ value: '60 min · 0.68', fill: '#fbbf24', fontSize: 10, position: 'insideTopRight' }} />
            <Area dataKey="csi" stroke={SERIES[0]} strokeWidth={2} fill={SERIES[0]} fillOpacity={0.15} />
          </AreaChart>
        </ChartPanel>
      </div>
    </div>
  );
}

import { Fragment, useMemo } from 'react';
import { Circle, CircleMarker, Tooltip as LTooltip } from 'react-leaflet';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Zap, TrendingUp, MapPin, Clock, Activity, Navigation, ListOrdered } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useWeatherLayers } from '../hooks/useWeatherLayers.js';
import { lightningClusters, clusterScaleByStep, strikeTotals, strikeRateHistory, lightningNetwork } from '../data/lightningData.js';
import { RISK_LEVELS } from '../utils/riskCalculator.js';
import { axisProps, gridProps, tooltipProps, SERIES } from '../utils/chartTheme.js';
import { cx, fmtCoord } from '../utils/formatters.js';
import WeatherMap from '../components/WeatherMap.jsx';
import Timeline from '../components/Timeline.jsx';
import { DemoTag, LevelBadge, PageHeader, Panel, ProbBar } from '../components/ui.jsx';

const LAYERS = { radar: false, satellite: false, lightning: true, risk: false, prediction: true, coverage: false, wind: false, rainfall: false };

function clusterLevel(count) {
  if (count >= 60) return RISK_LEVELS.HIGH;
  if (count >= 20) return RISK_LEVELS.MODERATE;
  return RISK_LEVELS.LOW;
}

export default function Lightning() {
  const { timeStep, sim, focusMap } = useApp();
  const { strikes } = useWeatherLayers(timeStep, sim);
  const scale = clusterScaleByStep[timeStep];
  const clusters = useMemo(
    () => lightningClusters.map((c) => {
      const strikesNow = Math.round(c.strikes * scale + (c.id === 'C1' ? sim.strikeExtra * 0.5 : 0));
      const own = strikes.filter((s) => c.cells.includes(s.cellId) && s.ageMin < 15);
      const center = own.length
        ? [own.reduce((a, s) => a + s.pos[0], 0) / own.length, own.reduce((a, s) => a + s.pos[1], 0) / own.length]
        : c.center;
      return { ...c, center, strikesNow, level: timeStep === 0 ? RISK_LEVELS[c.risk] : clusterLevel(strikesNow) };
    }),
    [scale, sim.strikeExtra, timeStep, strikes],
  );
  const total = strikeTotals[timeStep] + (sim.strikeExtra || 0);
  const prev = timeStep === 0 ? Math.round(148 / 1.18) : strikeTotals[timeStep - 1];
  const delta = Math.round(((total - prev) / prev) * 100);
  const cg = strikes.filter((s) => s.type === 'CG').length;
  const recent = [...strikes].sort((a, b) => a.ageMin - b.ageMin).slice(0, 12);
  const maxCluster = Math.max(...clusters.map((c) => c.strikesNow));

  const stats = [
    { label: 'Total strikes', value: total, sub: 'Last 30 minutes', icon: Zap, tone: 'text-amber-300' },
    { label: 'Last 10 min', value: `${delta >= 0 ? '+' : ''}${delta}%`, sub: 'vs previous 10 min', icon: TrendingUp, tone: delta >= 0 ? 'text-orange-300' : 'text-emerald-300' },
    { label: 'Highest density', value: 'Ramanagara', sub: `${clusters[0].strikesNow} strikes`, icon: MapPin, tone: 'text-red-300' },
    { label: 'Predicted peak', value: '10:15 IST', sub: 'Flash rate ~9.8 / min', icon: Clock, tone: 'text-cyan-300' },
    { label: 'CG fraction', value: `${Math.round((cg / Math.max(1, strikes.length)) * 100)}%`, sub: 'Cloud-to-ground', icon: Activity, tone: 'text-violet-300' },
  ];

  return (
    <div className="space-y-3">
      <PageHeader kicker={lightningNetwork.name} title="Lightning Intelligence" subtitle="Real-time stroke detection, clustering and short-term lightning path prediction" actions={<DemoTag />} />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="panel px-3.5 py-3">
            <div className="flex items-center justify-between"><p className="kicker">{s.label}</p><s.icon size={15} className={s.tone} /></div>
            <p className={cx('num mt-1 truncate text-2xl font-semibold', s.tone)}>{s.value}</p>
            <p className="text-[11px] text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="panel relative h-[max(520px,calc(100vh-300px))] overflow-hidden p-0">
          <WeatherMap
            layers={LAYERS}
            zoom={9.25}
            center={[12.95, 77.35]}
            showCellTags={false}
            showVillages={false}
            showRoleOverlays={false}
            mapChildren={() =>
              clusters.map((c) => (
                <Fragment key={c.id}>
                  <Circle pane="sat" center={c.center} radius={3000 + Math.sqrt(c.strikesNow) * 1300} interactive={false}
                    pathOptions={{ stroke: false, fillColor: c.level.color, fillOpacity: 0.1 }} />
                  <Circle pane="sat" center={c.center} radius={1500 + Math.sqrt(c.strikesNow) * 700} interactive={false}
                    pathOptions={{ color: c.level.color, weight: 1, opacity: 0.6, fillColor: c.level.color, fillOpacity: 0.12, dashArray: '3 4' }} />
                  <CircleMarker pane="labels" center={c.center} radius={0.1} pathOptions={{ opacity: 0, fillOpacity: 0 }}>
                    <LTooltip className="vn-tip" permanent direction="top" offset={[0, -4]}>
                      <b>{c.name}</b> · {c.strikesNow} strikes
                    </LTooltip>
                  </CircleMarker>
                </Fragment>
              ))
            }
          >
            <div className="absolute left-3 top-3 z-[800] space-y-2">
              <div className="panel-glass px-3 py-2">
                <p className="kicker !text-[9.5px] text-amber-300/80">Strike density map</p>
                <p className="text-[12.5px] font-semibold text-white">{strikes.length} strokes plotted · last 30 min</p>
              </div>
              <div className="panel-glass flex items-center gap-2 px-3 py-1.5 text-[11.5px] text-slate-200">
                <Navigation size={13} className="rotate-45 text-slate-100" /> Predicted Lightning Path (+30 min)
              </div>
            </div>
            <Timeline className="absolute bottom-3 left-3 right-3 z-[800] md:right-14" />
          </WeatherMap>
        </section>

        <aside className="flex flex-col gap-3">
          <Panel title="Top Lightning Clusters" icon={ListOrdered} bodyClass="p-2">
            <ol className="space-y-1.5">
              {clusters.map((c, i) => (
                <li key={c.id}>
                  <button onClick={() => focusMap(c.center, 10.5)} className="w-full rounded-md border border-line/70 px-2.5 py-2 text-left hover:bg-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      <span className="num grid h-6 w-6 shrink-0 place-items-center rounded bg-white/5 text-[12px] font-bold text-slate-300">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold text-slate-100">{c.name}</span>
                        <span className="num block text-[11.5px] text-slate-400">{c.strikesNow} strikes · +{c.growth}%/10 min</span>
                      </span>
                      <LevelBadge level={c.level}>{`${c.level.label} risk`}</LevelBadge>
                    </div>
                    <ProbBar value={(c.strikesNow / maxCluster) * 100} color={c.level.color} className="mt-2 !h-1" />
                  </button>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Stroke Rate · last 60 min" icon={Activity}>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strikeRateHistory} margin={{ top: 4, right: 4, left: -26, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="t" {...axisProps} tick={{ ...axisProps.tick, fontSize: 9 }} interval={2} />
                  <YAxis {...axisProps} tick={{ ...axisProps.tick, fontSize: 9 }} />
                  <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(148,178,222,0.06)' }} />
                  <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Bar dataKey="cg" name="Cloud-to-ground" stackId="a" fill={SERIES[1]} stroke="#070e1d" strokeWidth={1} />
                  <Bar dataKey="ic" name="Intra-cloud" stackId="a" fill={SERIES[0]} stroke="#070e1d" strokeWidth={1} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </aside>
      </div>

      <Panel title="Recent Strokes" kicker="Lightning Location Network feed (simulated)" icon={Zap} bodyClass="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[12px]">
            <thead>
              <tr className="border-b border-line text-left">
                {['Time (IST)', 'Type', 'Peak current', 'Location', 'Parent cell', 'District'].map((h) => (
                  <th key={h} className="kicker px-3.5 py-2 !text-[9.5px] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id} className="border-b border-line/50 hover:bg-white/[0.02]">
                  <td className="num px-3.5 py-1.5 text-slate-200">{s.time}</td>
                  <td className="px-3.5"><span className={cx('chip', s.type === 'CG' ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200')}>{s.type}</span></td>
                  <td className="num px-3.5 text-slate-200">{s.kA > 0 ? '+' : ''}{s.kA} kA</td>
                  <td className="num px-3.5 text-slate-400">{fmtCoord(s.pos)}</td>
                  <td className="num px-3.5 text-slate-300">{s.cellId}</td>
                  <td className="px-3.5 text-slate-400">{s.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

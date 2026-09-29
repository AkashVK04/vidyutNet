import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { CloudRain, Zap, ShieldAlert, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { nowcastProducts } from '../data/forecastData.js';
import { stormCells, cellStateAt, PRIMARY_CELL_ID } from '../data/stormCellsData.js';
import { timelineSteps } from '../data/timelineData.js';
import { probToLevel, dbzToIntensity } from '../utils/riskCalculator.js';
import { compass } from '../utils/geo.js';
import { fmtCoord } from '../utils/formatters.js';
import { tooltipProps } from '../utils/chartTheme.js';
import WeatherMap from '../components/WeatherMap.jsx';
import Timeline from '../components/Timeline.jsx';
import ForecastChart from '../components/ForecastChart.jsx';
import { StormCellDetail } from '../components/StormCellPanel.jsx';
import { DemoTag, LevelBadge, PageHeader, Panel } from '../components/ui.jsx';
import { RAIN_SCALE } from '../data/riskZonesData.js';

const ONLY = (keys) => ({ radar: false, satellite: false, lightning: false, risk: false, prediction: false, coverage: false, wind: false, rainfall: false, ...Object.fromEntries(keys.map((k) => [k, true])) });

const PRODUCTS = [
  { key: 'precipitation', icon: CloudRain, layers: ONLY(['rainfall', 'radar']), color: '#6366f1' },
  { key: 'lightning', icon: Zap, layers: ONLY(['lightning', 'satellite']), color: '#f59e0b' },
  { key: 'severe', icon: ShieldAlert, layers: ONLY(['risk', 'prediction']), color: '#ef4444' },
];

function ProductPanel({ def }) {
  const { timeStep } = useApp();
  const p = nowcastProducts[def.key];
  const prob = p.probability[timeStep];
  const level = probToLevel(prob);
  const val = p.values[timeStep];
  const rising = timeStep < 4;
  const series = p.values.map((v, i) => ({ t: timelineSteps[i].time, v }));
  return (
    <Panel
      title={p.title}
      kicker={p.subtitle}
      icon={def.icon}
      bodyClass="p-0"
      actions={<LevelBadge level={level} className="!text-[11px]" />}
    >
      <div className="relative h-[250px] border-b border-line">
        <WeatherMap layers={def.layers} zoom={8.75} center={[12.88, 77.35]} showVillages={false} showCellTags={false} zoomControl={false} followFocus={false} showLabels showRoleOverlays={false}>
          {def.key === 'precipitation' && (
            <div className="panel-glass absolute bottom-2 left-2 z-[800] flex items-center gap-1 px-2 py-1">
              {RAIN_SCALE.map((r) => (
                <span key={r.mm} className="flex flex-col items-center"><span className="h-1.5 w-6" style={{ background: r.color }} /><span className="num text-[9px] text-slate-400">{r.label}</span></span>
              ))}
              <span className="ml-1 text-[9px] text-slate-500">mm/h</span>
            </div>
          )}
        </WeatherMap>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-3.5">
        <div className="col-span-2 flex items-end justify-between">
          <div>
            <p className="kicker !text-[9.5px]">{def.key === 'lightning' ? 'Lightning risk' : def.key === 'severe' ? 'Severe weather risk' : 'Heavy rain risk'}</p>
            <p className="text-2xl font-bold tracking-tight" style={{ color: level.color }}>{level.key}</p>
          </div>
          <div className="text-right">
            <p className="kicker !text-[9.5px]">Probability</p>
            <p className="num text-2xl font-semibold text-white">{prob}%</p>
          </div>
        </div>
        <div>
          <p className="kicker !text-[9.5px]">{p.metricLabel}</p>
          <p className="num text-[14px] font-semibold text-slate-100">{val} {p.unit}</p>
        </div>
        <div>
          <p className="kicker !text-[9.5px]">Peak activity</p>
          <p className="num text-[14px] font-semibold text-slate-100">{p.peak}</p>
        </div>
        <div>
          <p className="kicker !text-[9.5px]">Confidence</p>
          <p className="num text-[14px] font-semibold text-cyan-200">{Math.max(60, p.confidence - timeStep)}%</p>
        </div>
        <div>
          <p className="kicker !text-[9.5px]">Trend</p>
          <p className={`flex items-center gap-1 text-[14px] font-semibold ${rising ? 'text-orange-300' : 'text-emerald-300'}`}>
            {rising ? <TrendingUp size={15} /> : <TrendingDown size={15} />} {rising ? 'Increasing' : 'Decreasing'}
          </p>
        </div>
        <div className="col-span-2">
          <p className="kicker !text-[9.5px]">Affected region</p>
          <p className="text-[13px] font-medium text-slate-200">{p.region}</p>
        </div>
        <div className="col-span-2 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="t" hide />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Tooltip {...tooltipProps} formatter={(v) => [`${v} ${p.unit}`, p.metricLabel]} />
              <ReferenceLine x={timelineSteps[timeStep].time} stroke="#22d3ee" strokeDasharray="3 3" />
              <Line dataKey="v" stroke={def.color} strokeWidth={2} dot={false} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Panel>
  );
}

function CellForecastTable({ cellId }) {
  const { timeStep } = useApp();
  const cell = stormCells.find((c) => c.id === cellId);
  const rows = timelineSteps.map((s) => ({ s, st: cellStateAt(cell, s.index) }));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-[12px]">
        <thead>
          <tr className="border-b border-line text-left">
            {['Valid time', 'Position', 'Reflectivity', 'Intensity', 'Lightning', 'Severe', 'Area'].map((h) => (
              <th key={h} className="kicker py-2 pr-3 !text-[9.5px] font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ s, st }) => {
            const int = dbzToIntensity(st.dbz);
            return (
              <tr key={s.index} className={`border-b border-line/60 ${s.index === timeStep ? 'bg-cyan-400/[0.07]' : ''}`}>
                <td className="num py-1.5 pr-3 text-slate-200">{s.index === 0 ? 'NOW' : s.label} · {s.time}</td>
                <td className="num pr-3 text-slate-400">{fmtCoord(st.pos)}</td>
                <td className="num pr-3 font-semibold" style={{ color: int.color }}>{Math.round(st.dbz)} dBZ</td>
                <td className="pr-3 text-slate-300">{int.label}</td>
                <td className="num pr-3 text-amber-200">{Math.round(st.lightningProb)}%</td>
                <td className="num pr-3 text-red-300">{Math.round(st.severeProb)}%</td>
                <td className="num pr-3 text-slate-300">{st.areaKm2.toFixed(1)} km²</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Nowcast() {
  const [params] = useSearchParams();
  const { selectedCellId, setSelectedCellId, timeStep, sim } = useApp();
  const paramCell = params.get('cell');

  useEffect(() => {
    if (paramCell && stormCells.some((c) => c.id === paramCell)) setSelectedCellId(paramCell);
  }, [paramCell, setSelectedCellId]);

  const focusId = selectedCellId || PRIMARY_CELL_ID;
  const focusCell = cellStateAt(stormCells.find((c) => c.id === focusId), timeStep, sim.dbzJitter);

  return (
    <div className="space-y-3">
      <PageHeader
        kicker="0–60 minute nowcast"
        title="Hyperlocal Nowcast"
        subtitle="AI-generated 0–60 minute severe weather forecast"
        actions={<DemoTag />}
      />
      <Timeline />
      <div className="grid gap-3 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <ProductPanel key={p.key} def={p} />
        ))}
      </div>

      <Panel title={`Detailed Cell Forecast · ${focusId}`} kicker={`${focusCell.district} · moving ${compass(focusCell.heading)} at ${focusCell.speedKmh} km/h`} icon={Target}
        actions={
          <select className="field !w-auto !py-1 !text-xs" value={focusId} onChange={(e) => setSelectedCellId(e.target.value)} aria-label="Select storm cell">
            {stormCells.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.locality}</option>)}
          </select>
        }>
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <StormCellDetail cell={focusCell} />
          <CellForecastTable cellId={focusId} />
        </div>
      </Panel>

      <ForecastChart />
    </div>
  );
}

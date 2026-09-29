import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, Satellite, Zap, Merge, BrainCircuit, MapPinned, Siren, ShieldCheck, Play, Square, ArrowRight, Truck, Cable, PlaneLanding, TrainFront, Plus, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useStormCells } from '../hooks/useWeatherLayers.js';
import { useInfrastructureExposure } from './map/layers.jsx';
import { responseTeams } from '../data/systemData.js';
import { airportObs } from '../data/infrastructureData.js';
import { SEVERITY } from '../utils/riskCalculator.js';
import { RoleSelector } from './Selectors.jsx';
import { Panel, SeverityBadge, StatusDot, Tooltip } from './ui.jsx';
import { cx } from '../utils/formatters.js';

const FLOW = [
  { label: 'Multi-source data', icon: Radar, extra: [Satellite, Zap] },
  { label: 'Data fusion', icon: Merge },
  { label: 'AI nowcasting', icon: BrainCircuit },
  { label: 'Hyperlocal risk', icon: MapPinned },
  { label: 'Early warning', icon: Siren },
  { label: 'Action', icon: ShieldCheck },
];

export function StatusBar() {
  const { clockFull, demoMode, scenarioRunning, startScenario, stopScenario } = useApp();
  return (
    <div className="panel relative z-30 flex flex-wrap items-center gap-x-5 gap-y-2.5 px-3.5 py-2.5">
      <div className="flex items-center gap-2.5">
        <StatusDot />
        <div className="leading-tight">
          <p className="kicker !text-[9.5px]">System status</p>
          <p className="text-[13px] font-semibold text-emerald-300">Operational</p>
        </div>
      </div>
      <div className="leading-tight">
        <p className="kicker !text-[9.5px]">Last updated</p>
        <p className="num text-[13px] font-semibold text-slate-100">{clockFull} IST</p>
      </div>
      <div className="leading-tight">
        <p className="kicker !text-[9.5px]">Data refresh</p>
        <p className="text-[13px] font-semibold text-slate-100">Every 10 minutes</p>
      </div>

      <div className="order-last hidden w-full items-center gap-1 overflow-x-auto border-t border-line pt-2.5 lg:flex 2xl:order-none 2xl:w-auto 2xl:flex-1 2xl:border-l 2xl:border-t-0 2xl:pl-4 2xl:pt-0">
        {FLOW.map((f, i) => (
          <div key={f.label} className="flex shrink-0 items-center gap-1">
            <span className={cx('flex items-center gap-1.5 rounded border px-2 py-1 text-[11px] font-medium', i === FLOW.length - 1 ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : 'border-line bg-white/[0.02] text-slate-300')}>
              <f.icon size={12} className="text-cyan-300" />
              {f.extra?.map((E, k) => <E key={k} size={12} className="-ml-0.5 text-cyan-300" />)}
              {f.label}
            </span>
            {i < FLOW.length - 1 && (
              <span className="relative block h-px w-5 bg-cyan-400/25">
                <motion.span className="absolute -top-[2px] h-[5px] w-[5px] rounded-full bg-cyan-300" animate={{ x: [0, 16], opacity: [0, 1, 0] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }} />
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <RoleSelector />
        {scenarioRunning ? (
          <button onClick={stopScenario} className="btn-amber"><Square size={13} /> Stop Scenario</button>
        ) : (
          <Tooltip label="Karnataka Severe Thunderstorm Event (09:40 → 10:40)">
            <button onClick={startScenario} className="btn-amber"><Play size={13} /> Start Scenario</button>
          </Tooltip>
        )}
        {demoMode && !scenarioRunning && <span className="chip border-amber-400/30 bg-amber-400/10 text-amber-200">Simulation</span>}
      </div>
    </div>
  );
}

export function ActiveAlertsMini({ className, limit = 3 }) {
  const { alerts, setActiveAlertId, setCreateAlertOpen } = useApp();
  const navigate = useNavigate();
  const list = alerts.filter((a) => a.status === 'active').sort((a, b) => SEVERITY[b.severity].rank - SEVERITY[a.severity].rank).slice(0, limit);
  return (
    <Panel
      className={className}
      title="Active Warnings"
      icon={Siren}
      bodyClass="p-2"
      actions={
        <>
          <Tooltip label="Create alert"><button onClick={() => setCreateAlertOpen(true)} className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Create alert"><Plus size={14} /></button></Tooltip>
          <button onClick={() => navigate('/app/alerts')} className="flex items-center gap-0.5 text-[11px] text-cyan-300 hover:text-cyan-100">All <ArrowRight size={12} /></button>
        </>
      }
    >
      <ul className="space-y-1.5">
        {list.map((a) => (
          <li key={a.id}>
            <button onClick={() => setActiveAlertId(a.id)} className="relative w-full overflow-hidden rounded-md border border-line/70 bg-white/[0.015] py-2 pl-3 pr-2 text-left hover:bg-white/[0.04]">
              <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: SEVERITY[a.severity].color }} />
              <div className="flex items-center justify-between gap-2">
                <SeverityBadge severity={a.severity} />
                <span className="num text-[10.5px] text-slate-500">Onset {a.onset}</span>
              </div>
              <p className="mt-1 truncate text-[12.5px] font-semibold uppercase tracking-wide text-slate-100">{a.title}</p>
              <p className="truncate text-[11.5px] text-slate-400">{a.location} · conf. {a.confidence}%</p>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function RoleList({ title, icon, rows, className }) {
  return (
    <Panel className={className} title={title} icon={icon} bodyClass="p-2">
      <ul className="space-y-1">
        {rows.map((r) => (
          <li key={r.k} className="flex items-center justify-between gap-2 rounded-md border border-line/60 px-2.5 py-1.5 text-[12px]">
            <span className="min-w-0">
              <span className="block truncate font-medium text-slate-100">{r.k}</span>
              {r.sub && <span className="block truncate text-[10.5px] text-slate-500">{r.sub}</span>}
            </span>
            <span className={cx('chip shrink-0', r.cls)}>{r.v}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const expCls = (e) => (e > 12 ? 'border-red-500/40 bg-red-500/15 text-red-300' : e > 5 ? 'border-orange-400/40 bg-orange-500/15 text-orange-300' : e > 0 ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300');
const expTxt = (e) => (e > 12 ? 'Severe' : e > 5 ? 'In path' : e > 0 ? 'Watch' : 'Clear');

export function RoleFocusPanel({ className }) {
  const { role, timeStep, sim } = useApp();
  const cells = useStormCells(timeStep, sim.dbzJitter);
  const exp = useInfrastructureExposure(cells);

  if (role === 'ndrf') {
    return <RoleList className={className} title="Response Teams" icon={Truck} rows={responseTeams.map((t) => ({ k: t.name, sub: `${t.base} · ETA ${t.eta}`, v: t.status, cls: t.status === 'Alerted' ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' }))} />;
  }
  if (role === 'power') {
    return <RoleList className={className} title="Transmission Assets" icon={Cable} rows={[...exp.lines].sort((a, b) => b.exposure - a.exposure).map((l) => ({ k: l.name, sub: `${l.kv} kV corridor`, v: expTxt(l.exposure), cls: expCls(l.exposure) }))} />;
  }
  if (role === 'rail') {
    return <RoleList className={className} title="Rail Sections" icon={TrainFront} rows={[...exp.rail].sort((a, b) => b.exposure - a.exposure).map((r) => ({ k: r.name, sub: `${r.line} · ${r.trains} trains/h`, v: expTxt(r.exposure), cls: expCls(r.exposure) }))} />;
  }
  if (role === 'airport') {
    const kia = exp.air[0];
    return (
      <RoleList
        className={className}
        title="Aerodrome Ops · VOBL"
        icon={PlaneLanding}
        rows={[
          { k: 'Nearest convective cell', sub: 'Edge of ≥38 dBZ echo', v: `${kia.nearestKm.toFixed(0)} km`, cls: kia.nearestKm < 20 ? 'border-red-500/40 bg-red-500/15 text-red-300' : 'border-violet-400/30 bg-violet-400/10 text-violet-200' },
          { k: 'Surface wind', sub: `Gust ${airportObs.gust + timeStep * 2} kt`, v: `${airportObs.windDir}°/${airportObs.windSpeed} kt`, cls: 'border-line text-slate-200' },
          { k: 'Visibility', sub: 'Prevailing', v: `${Math.max(1.5, airportObs.visibility - timeStep * 0.6).toFixed(1)} km`, cls: 'border-line text-slate-200' },
          { k: 'Ramp lightning alert', sub: 'Strikes < 8 km', v: kia.nearestKm < 8 ? 'ACTIVE' : 'Standby', cls: kia.nearestKm < 8 ? 'border-red-500/40 bg-red-500/15 text-red-300' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' },
          { k: 'Runways', sub: 'Operational', v: airportObs.runways.join(' · '), cls: 'border-line text-slate-300' },
        ]}
      />
    );
  }
  return <ActiveAlertsMini className={className} />;
}

export function MoreLink({ to, children }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)} className="flex items-center gap-0.5 text-[11px] text-cyan-300 hover:text-cyan-100">
      {children} <ChevronRight size={12} />
    </button>
  );
}

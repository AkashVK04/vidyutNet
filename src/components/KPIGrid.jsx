import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CloudLightning, Zap, ShieldAlert, Home, Timer, RadioTower, Users, Truck, PlaneLanding, Wind, Eye, TrainFront, Cable, Factory } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useWeatherLayers, useVillageStates } from '../hooks/useWeatherLayers.js';
import { useInfrastructureExposure } from './map/layers.jsx';
import { kpiSeries, responseTeams } from '../data/systemData.js';
import { strikeTotals } from '../data/lightningData.js';
import { airports, airportObs } from '../data/infrastructureData.js';
import { haversineKm } from '../utils/geo.js';
import { cx, fmtInt } from '../utils/formatters.js';

const TONES = {
  cyan: 'text-cyan-300 bg-cyan-400/10',
  amber: 'text-amber-300 bg-amber-400/10',
  orange: 'text-orange-300 bg-orange-400/10',
  red: 'text-red-300 bg-red-500/10',
  green: 'text-emerald-300 bg-emerald-400/10',
  violet: 'text-violet-300 bg-violet-400/10',
};

function KPICard({ icon: Icon, label, value, sub, subTone = 'text-slate-500', tone = 'cyan', large }) {
  return (
    <div className="panel relative overflow-hidden px-3.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className="kicker truncate">{label}</p>
        <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-md', TONES[tone])}>
          <Icon size={15} />
        </span>
      </div>
      <motion.p key={String(value)} initial={{ opacity: 0.4, y: 3 }} animate={{ opacity: 1, y: 0 }} className={cx('num -mt-1 font-semibold tracking-tight text-white', large ? 'text-4xl' : 'text-[26px]')}>
        {value}
      </motion.p>
      <p className={cx('mt-0.5 truncate text-[11.5px]', subTone)}>{sub}</p>
    </div>
  );
}

export function useKpis() {
  const { timeStep, sim, role } = useApp();
  const { cells, strikes } = useWeatherLayers(timeStep, sim);
  const villages = useVillageStates(timeStep, sim.riskJitter);
  const exposure = useInfrastructureExposure(cells);
  return useMemo(() => {
    const strikesNow = strikeTotals[timeStep] + (sim.strikeExtra || 0);
    const prev = timeStep === 0 ? Math.round(148 / 1.18) : strikeTotals[timeStep - 1];
    const delta = Math.round(((strikesNow - prev) / prev) * 100);
    const lightning = {
      icon: Zap, label: 'Lightning Strikes', value: fmtInt(strikesNow), tone: 'amber',
      sub: `${delta >= 0 ? '+' : ''}${delta}% in last 10 min`, subTone: delta >= 0 ? 'text-amber-300' : 'text-emerald-300',
    };
    const stormCells = { icon: CloudLightning, label: 'Active Storm Cells', value: kpiSeries.stormCells[timeStep], tone: 'cyan', sub: `${cells.filter((c) => c.dbz >= 50).length} severe (≥50 dBZ)` };
    const zones = { icon: ShieldAlert, label: 'High Risk Zones', value: kpiSeries.highRiskZones[timeStep], tone: 'orange', sub: 'Ramanagara · Bengaluru Rural' };
    const atRisk = villages.filter((v) => v.level.key !== 'LOW');
    const villagesKpi = { icon: Home, label: 'Villages at Risk', value: kpiSeries.villagesAtRisk[timeStep], tone: 'red', sub: `${atRisk.filter((v) => ['HIGH', 'SEVERE'].includes(v.level.key)).length} tracked localities high+` };
    const lead = { icon: Timer, label: 'Forecast Lead Time', value: kpiSeries.leadTime, tone: 'green', sub: 'Nowcast horizon 0–60 min' };
    const coverage = { icon: RadioTower, label: 'Radar Coverage', value: `${kpiSeries.radarCoverage}%`, tone: 'cyan', sub: '3 of 4 radars nominal' };
    const pop = atRisk.reduce((s, v) => s + v.population, 0) * 4.2;

    switch (role) {
      case 'ndrf':
        return [villagesKpi, { icon: Users, label: 'Population Exposed', value: fmtInt(pop), tone: 'orange', sub: 'Within high/moderate zones' },
          { icon: Truck, label: 'Teams on Standby', value: responseTeams.length, tone: 'green', sub: 'Nearest ETA 9 min' }, zones, lightning, lead];
      case 'power': {
        const lines = exposure.lines.filter((l) => l.exposure > 5).length;
        const subs = exposure.subs.filter((s) => s.exposure > 5).length;
        return [lightning, { icon: Cable, label: 'Lines in Storm Path', value: `${lines}/${exposure.lines.length}`, tone: 'red', sub: '220/400 kV corridors' },
          { icon: Factory, label: 'Substations at Risk', value: `${subs}/${exposure.subs.length}`, tone: 'orange', sub: 'Within 2× cell radius' }, stormCells, lead, coverage];
      }
      case 'airport': {
        const kia = airports[0];
        const near = strikes.filter((s) => haversineKm(s.pos, kia.pos) < 20).length;
        const nearest = Math.max(0, Math.min(...cells.filter((c) => c.dbz >= 38).map((c) => haversineKm(kia.pos, c.pos) - c.radiusKm)));
        return [stormCells, { icon: PlaneLanding, label: 'Nearest Cell · VOBL', value: `${nearest.toFixed(0)} km`, tone: nearest < 20 ? 'red' : 'violet', sub: 'Edge of ≥38 dBZ echo' },
          { icon: Zap, label: 'Strikes < 20 km VOBL', value: near, tone: 'amber', sub: 'Ramp closure at < 8 km' },
          { icon: Wind, label: 'Wind / Gust', value: `${airportObs.windSpeed}/${airportObs.gust + timeStep * 2} kt`, tone: 'cyan', sub: `${airportObs.windDir}° · outflow expected` },
          { icon: Eye, label: 'Visibility', value: `${Math.max(1.5, airportObs.visibility - timeStep * 0.6).toFixed(1)} km`, tone: 'green', sub: 'Reducing in rain' }, lead];
      }
      case 'rail': {
        const at = exposure.rail.filter((r) => r.exposure > 0);
        return [{ icon: TrainFront, label: 'Sections at Risk', value: `${at.length}/${exposure.rail.length}`, tone: 'red', sub: 'Bengaluru–Mysuru corridor' },
          { icon: Users, label: 'Trains Affected', value: at.reduce((s, r) => s + r.trains, 0), tone: 'orange', sub: 'Next 60 minutes' }, stormCells, lightning, lead, coverage];
      }
      default:
        return [stormCells, lightning, zones, villagesKpi, lead, coverage];
    }
  }, [timeStep, sim.strikeExtra, role, cells, strikes, villages, exposure]);
}

export default function KPIGrid({ large = false, className }) {
  const kpis = useKpis();
  return (
    <div className={cx('grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6', className)}>
      {kpis.map((k) => (
        <KPICard key={k.label} {...k} large={large} />
      ))}
    </div>
  );
}

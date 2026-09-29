import { MapPinned } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useVillageStates } from '../hooks/useWeatherLayers.js';
import { cx, fmtInt } from '../utils/formatters.js';
import { LevelBadge, Panel, ProbBar } from './ui.jsx';

export default function VillageWarnings({ className, limit = 6, dense = false }) {
  const { timeStep, sim, focusMap } = useApp();
  const villages = useVillageStates(timeStep, sim.riskJitter).slice(0, limit);
  return (
    <Panel className={className} title="Hyperlocal Warnings" kicker="Village level" icon={MapPinned} bodyClass="p-2">
      <ul className="space-y-1.5">
        {villages.map((v) => (
          <li key={v.id}>
            <button onClick={() => focusMap(v.pos, 11.5)} className="w-full rounded-md border border-line/70 bg-white/[0.015] px-2.5 py-2 text-left hover:border-slate-500/40 hover:bg-white/[0.04]" title="Show on map">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[13px] font-semibold text-slate-100">{v.name}</span>
                <LevelBadge level={v.level} />
              </div>
              <div className={cx('mt-1.5 grid gap-x-3 text-[11px]', dense ? 'grid-cols-2' : 'grid-cols-3')}>
                <span className="text-slate-500">Lightning <span className="num block text-[12px] font-semibold text-slate-200">{Math.round(v.lightningProb)}%</span></span>
                <span className="text-slate-500">Onset <span className="num block text-[12px] font-semibold text-slate-200">{v.onsetText}</span></span>
                {!dense && <span className="text-slate-500">Population <span className="num block text-[12px] font-semibold text-slate-200">{fmtInt(v.population)}</span></span>}
              </div>
              <ProbBar value={v.lightningProb} color={v.level.color} className="mt-1.5 !h-1" />
              <p className="mt-1.5 font-mono text-[10.5px] font-bold tracking-wider" style={{ color: v.level.color }}>
                ACTION: {v.action}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

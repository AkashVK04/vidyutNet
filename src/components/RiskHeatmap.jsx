import { Grid3X3, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { districts, districtStateAt } from '../data/districtsData.js';
import { timelineSteps } from '../data/timelineData.js';
import { scoreToLevel, districtAction, RISK_LEVELS } from '../utils/riskCalculator.js';
import { cx, fmtInt } from '../utils/formatters.js';
import { LevelBadge, Panel, ProbBar } from './ui.jsx';

export default function RiskHeatmap({ className }) {
  const { timeStep, setTimeStep, selectedDistrictId, setSelectedDistrictId, sim, focusMap } = useApp();
  const selected = districts.find((d) => d.id === selectedDistrictId) || districts.find((d) => d.id === 'RMN');
  const sel = districtStateAt(selected, timeStep, sim.riskJitter);
  const lvl = scoreToLevel(sel.score);

  return (
    <Panel
      className={className}
      title="District Risk Heatmap"
      kicker="0–60 min nowcast"
      icon={Grid3X3}
      actions={
        <div className="hidden items-center gap-2 sm:flex">
          {Object.values(RISK_LEVELS).map((l) => (
            <span key={l.key} className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="h-2 w-2 rounded-sm" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] border-separate border-spacing-[3px]">
            <thead>
              <tr>
                <th className="kicker w-32 text-left !text-[9.5px] font-medium">District</th>
                {timelineSteps.map((s) => (
                  <th key={s.index} className="p-0">
                    <button onClick={() => setTimeStep(s.index)} className={cx('num w-full rounded py-0.5 text-[10px] font-medium', s.index === timeStep ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-500 hover:text-slate-300')}>
                      {s.index === 0 ? 'NOW' : s.time}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => {
                const isSel = d.id === selected.id;
                return (
                  <tr key={d.id} className="group cursor-pointer" onClick={() => { setSelectedDistrictId(d.id); focusMap(d.centroid, 9.5); }}>
                    <td className={cx('truncate pr-2 text-[12px]', isSel ? 'font-semibold text-cyan-200' : 'text-slate-300 group-hover:text-white')}>
                      {isSel && <span className="mr-1 text-cyan-300">▸</span>}
                      {d.name}
                    </td>
                    {d.risk.map((score, i) => {
                      const l = scoreToLevel(score);
                      return (
                        <td
                          key={i}
                          title={`${d.name} · ${timelineSteps[i].time} · risk ${score} (${l.label})`}
                          className={cx('h-7 rounded-[3px] text-center transition-all', i === timeStep && 'ring-1 ring-white/70', isSel && 'outline outline-1 outline-cyan-400/40')}
                          style={{ background: l.color, opacity: 0.25 + (score / 100) * 0.75 }}
                        >
                          <span className="num text-[10px] font-bold text-black/75">{score}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-md border border-line bg-white/[0.015] p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="kicker !text-[9.5px]">District</p>
              <p className="text-[15px] font-semibold text-white">{sel.name}</p>
            </div>
            <LevelBadge level={lvl} />
          </div>
          <div className="mt-2 flex items-end gap-1.5">
            <span className="num text-3xl font-semibold" style={{ color: lvl.color }}>{Math.round(sel.score)}</span>
            <span className="mb-1 text-[11px] text-slate-500">/ 100 risk score</span>
          </div>
          <div className="mt-2 space-y-1.5 text-[11.5px]">
            {[
              ['Lightning probability', sel.lightningProb, '#f59e0b'],
              ['Rainfall probability', sel.rainfallProb, '#3b82f6'],
              ['Thunderstorm probability', sel.thunderstormProb, '#ef4444'],
            ].map(([k, v, c]) => (
              <div key={k}>
                <div className="mb-0.5 flex justify-between"><span className="text-slate-400">{k}</span><span className="num font-semibold text-slate-100">{Math.round(v)}%</span></div>
                <ProbBar value={v} color={c} className="!h-1" />
              </div>
            ))}
          </div>
          <div className="mt-2.5 flex justify-between border-t border-line pt-2 text-[11.5px]">
            <span className="text-slate-400">Affected population</span>
            <span className="num font-semibold text-slate-100">{fmtInt(sel.affectedPopulation)}</span>
          </div>
          <p className="mt-2 text-[11.5px] leading-snug text-slate-300">
            <span className="kicker mr-1 !text-[9.5px]">Action</span>
            {districtAction(lvl.key)}
          </p>
          <button className="btn-ghost mt-2.5 w-full !text-xs" onClick={() => focusMap(sel.centroid, 9.8)}>
            <MapPin size={13} /> Show on map
          </button>
        </div>
      </div>
    </Panel>
  );
}

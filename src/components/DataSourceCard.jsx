import { Radar, Satellite, Zap } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { StatusDot } from './ui.jsx';
import { tooltipProps } from '../utils/chartTheme.js';

const ICONS = { radar: Radar, satellite: Satellite, lightning: Zap };

export default function DataSourceCard({ source, index }) {
  const Icon = ICONS[source.id];
  const series = source.latency.map((v, i) => ({ i, v }));
  return (
    <article className="panel overflow-hidden">
      <div className="flex items-start justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
            <Icon size={19} />
          </span>
          <div>
            <p className="kicker">{index}. {source.short}</p>
            <h3 className="text-[14px] font-semibold uppercase tracking-wide text-white">{source.name}</h3>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10.5px] font-bold tracking-wider text-emerald-300">
          <StatusDot size="h-1.5 w-1.5" /> {source.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3">
        {source.stats.map((s) => (
          <div key={s.label}>
            <p className="kicker !text-[9.5px]">{s.label}</p>
            <p className="num mt-0.5 text-[15px] font-semibold text-slate-100">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="px-4 pb-3">
        <p className="kicker mb-1.5 !text-[9.5px]">Data products</p>
        <div className="flex flex-wrap gap-1.5">
          {source.products.map((p) => (
            <span key={p} className="num rounded border border-line bg-white/[0.03] px-2 py-0.5 text-[11.5px] text-cyan-100">{p}</span>
          ))}
        </div>
      </div>
      <div className="border-t border-line px-4 pb-2 pt-2.5">
        <div className="flex justify-between">
          <p className="kicker !text-[9.5px]">Ingest latency · last 2 h (s)</p>
          <p className="num text-[11px] text-slate-400">{source.latency[source.latency.length - 1]} s</p>
        </div>
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <Tooltip {...tooltipProps} labelFormatter={() => ''} formatter={(v) => [`${v} s`, 'Latency']} />
              <Area type="monotone" dataKey="v" stroke="#0ea5c6" strokeWidth={1.5} fill="#0ea5c6" fillOpacity={0.12} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </article>
  );
}

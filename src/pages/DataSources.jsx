import { useEffect, useState } from 'react';
import { Workflow, RadioTower } from 'lucide-react';
import { dataSources, pipelineStages } from '../data/systemData.js';
import { radarStations } from '../data/radarData.js';
import DataSourceCard from '../components/DataSourceCard.jsx';
import AIEnginePipeline from '../components/AIEnginePipeline.jsx';
import { DemoTag, PageHeader, Panel, Skeleton, StatusDot } from '../components/ui.jsx';
import { cx } from '../utils/formatters.js';

export default function DataSources() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="space-y-3">
      <PageHeader kicker="Observation network" title="Data Sources Monitor" subtitle="Ingestion status for radar, satellite and lightning feeds" actions={<DemoTag>Simulated feeds</DemoTag>} />

      <div className="grid gap-3 lg:grid-cols-3">
        {loading
          ? [0, 1, 2].map((i) => (
              <div key={i} className="panel space-y-3 p-4">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))
          : dataSources.map((s, i) => <DataSourceCard key={s.id} source={s} index={i + 1} />)}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <Panel title="Data Pipeline Status" icon={Workflow} actions={<span className="num rounded bg-emerald-400/10 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-300">6/6 Healthy</span>} bodyClass="p-0">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-line text-left">
                {['Stage', 'Status', 'Latency', 'Throughput'].map((h) => <th key={h} className="kicker px-3.5 py-2 !text-[9.5px] font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {pipelineStages.map((p) => (
                <tr key={p.id} className="border-b border-line/50">
                  <td className="px-3.5 py-2 text-slate-200">{p.name}</td>
                  <td className="px-3.5"><span className="flex items-center gap-2 text-emerald-300"><StatusDot size="h-1.5 w-1.5" /> {p.status}</span></td>
                  <td className="num px-3.5 text-slate-300">{p.latency}</td>
                  <td className="num px-3.5 text-slate-400">{p.throughput}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Radar Network" icon={RadioTower} bodyClass="p-0">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-line text-left">
                {['Station', 'Range', 'Last scan', 'Status'].map((h) => <th key={h} className="kicker px-3.5 py-2 !text-[9.5px] font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {radarStations.map((r) => (
                <tr key={r.id} className="border-b border-line/50">
                  <td className="px-3.5 py-2"><span className="block text-slate-200">{r.name}</span><span className="num text-[10.5px] text-slate-500">{r.id} · elev {r.elevation}</span></td>
                  <td className="num px-3.5 text-slate-300">{r.rangeKm} km</td>
                  <td className="num px-3.5 text-slate-300">{r.lastScan} IST</td>
                  <td className="px-3.5">
                    <span className={cx('chip', r.status === 'ONLINE' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/30 bg-amber-400/10 text-amber-200')}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-3.5 py-2 text-[11px] text-slate-500">X-band Ramanagara in degraded mode (partial beam blockage, simulated). Overall coverage 94%.</p>
        </Panel>
      </div>

      <AIEnginePipeline />
    </div>
  );
}

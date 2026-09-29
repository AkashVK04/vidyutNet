import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Plus, Megaphone, Radio, Siren } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { SEVERITY } from '../utils/riskCalculator.js';
import { disseminationChannels } from '../data/alertsData.js';
import AlertCard from '../components/AlertCard.jsx';
import VillageWarnings from '../components/VillageWarnings.jsx';
import { DemoTag, PageHeader, Panel } from '../components/ui.jsx';
import { cx } from '../utils/formatters.js';

const FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'ACKNOWLEDGED'];

export default function Alerts() {
  const { alerts, setCreateAlertOpen } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const active = alerts.filter((a) => a.status === 'active');
  const count = (s) => active.filter((a) => a.severity === s).length;

  const shown = alerts
    .filter((a) => (filter === 'ALL' ? true : filter === 'ACKNOWLEDGED' ? a.status === 'acknowledged' : a.severity === filter && a.status === 'active'))
    .sort((a, b) => (a.status === b.status ? SEVERITY[b.severity].rank - SEVERITY[a.severity].rank : a.status === 'active' ? -1 : 1));

  const summary = [
    { k: 'Active Alerts', v: active.length, cls: 'text-white', bar: 'bg-cyan-400' },
    { k: 'Critical', v: count('CRITICAL'), cls: 'text-red-300', bar: 'bg-red-500' },
    { k: 'High', v: count('HIGH'), cls: 'text-orange-300', bar: 'bg-orange-400' },
    { k: 'Moderate', v: count('MODERATE'), cls: 'text-yellow-300', bar: 'bg-yellow-400' },
  ];

  return (
    <div className="space-y-3">
      <PageHeader
        kicker="Alert Center"
        title="Early Warning Center"
        subtitle="Impact-based warnings generated from the 0–60 min nowcast"
        actions={
          <>
            <DemoTag />
            <button className="btn-ghost" onClick={() => navigate('/public')}><Megaphone size={14} /> Public Warning Mode</button>
            <button className="btn-primary" onClick={() => setCreateAlertOpen(true)}><Plus size={14} /> Create Alert</button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {summary.map((s) => (
          <div key={s.k} className="panel relative overflow-hidden px-4 py-3">
            <span className={cx('absolute inset-x-0 top-0 h-0.5', s.bar)} />
            <p className="kicker">{s.k}</p>
            <p className={cx('num mt-1 text-3xl font-semibold', s.cls)}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="mb-2.5 flex flex-wrap gap-1" role="tablist">
            {FILTERS.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={cx('rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider', filter === f ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100' : 'border-line text-slate-400 hover:text-white')}>
                {f}
              </button>
            ))}
          </div>
          <div className="grid gap-2.5 xl:grid-cols-2">
            <AnimatePresence initial={false}>
              {shown.map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
            </AnimatePresence>
            {shown.length === 0 && <p className="panel col-span-full px-4 py-10 text-center text-sm text-slate-500">No alerts in this category.</p>}
          </div>
        </div>

        <aside className="flex flex-col gap-3">
          <VillageWarnings limit={5} />
          <Panel title="Dissemination Channels" icon={Radio} bodyClass="p-2.5">
            <ul className="space-y-1.5">
              {disseminationChannels.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded border border-line/60 px-2.5 py-1.5 text-[12px]">
                  <span className="text-slate-300">{c.name}</span>
                  <span className="chip border-amber-400/25 bg-amber-400/10 text-amber-200">{c.status}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500"><Siren size={12} className="mt-0.5 shrink-0" /> Prototype: channels are simulated. No SMS, CAP or API requests are made.</p>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

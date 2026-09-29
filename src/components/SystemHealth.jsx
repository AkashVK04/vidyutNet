import { Activity } from 'lucide-react';
import { systemHealth } from '../data/systemData.js';
import { Panel, StatusDot } from './ui.jsx';

export default function SystemHealth({ className }) {
  return (
    <Panel
      className={className}
      title="System Health"
      icon={Activity}
      actions={<span className="num rounded bg-emerald-400/10 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-300">6/6 Operational</span>}
      bodyClass="px-3.5 py-2.5"
    >
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {systemHealth.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2 text-[12px] text-slate-300">
            <span style={{ animationDelay: `${i * 0.25}s` }} className="contents">
              <StatusDot size="h-1.5 w-1.5" />
            </span>
            <span className="truncate">{s.name}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

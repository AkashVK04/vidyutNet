import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, Megaphone, ChevronRight, Clock, Users, Gauge, CheckCircle2, Zap, CloudRain, CloudLightning, TriangleAlert } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { SEVERITY } from '../utils/riskCalculator.js';
import { cx, fmtInt } from '../utils/formatters.js';
import { SeverityBadge } from './ui.jsx';

export const HAZARD_ICON = { Thunderstorm: CloudLightning, Lightning: Zap, 'Heavy Rain': CloudRain, 'Severe Weather': TriangleAlert };

export default function AlertCard({ alert, compact = false }) {
  const { setActiveAlertId, focusMap, toast } = useApp();
  const navigate = useNavigate();
  const sev = SEVERITY[alert.severity];
  const Icon = HAZARD_ICON[alert.hazard] || CloudLightning;
  const acked = alert.status === 'acknowledged';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cx('panel group relative overflow-hidden', acked && 'opacity-70')}
    >
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: sev.color }} />
      {alert.severity === 'CRITICAL' && !acked && <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-500/[0.07] to-transparent" />}
      <div className={cx('relative pl-4 pr-3.5', compact ? 'py-2.5' : 'py-3')}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <SeverityBadge severity={alert.severity} />
            {acked && <span className="chip border-emerald-400/30 bg-emerald-400/10 text-emerald-300"><CheckCircle2 size={10} /> ACK</span>}
            {alert.simulated && <span className="chip border-amber-400/25 bg-amber-400/10 text-amber-200">SIM</span>}
            {alert.generated && <span className="chip border-cyan-400/25 bg-cyan-400/10 text-cyan-200">PROTOTYPE</span>}
          </div>
          <span className="num text-[10.5px] text-slate-500">{alert.id} · {alert.issued}</span>
        </div>

        <button onClick={() => setActiveAlertId(alert.id)} className="mt-2 block w-full text-left">
          <h4 className="flex items-center gap-2 text-[13.5px] font-bold uppercase tracking-wide text-white">
            <Icon size={15} style={{ color: sev.color }} /> {alert.title}
          </h4>
          <p className="mt-0.5 text-[13px] font-medium text-slate-200">{alert.location}</p>
          {!compact && <p className="mt-1 text-[12px] leading-snug text-slate-400">{alert.summary}</p>}
        </button>

        <div className={cx('mt-2.5 grid gap-2 text-[11px]', compact ? 'grid-cols-3' : 'grid-cols-3')}>
          <div>
            <p className="flex items-center gap-1 text-slate-500"><Clock size={11} /> Onset</p>
            <p className="num font-semibold text-slate-100">{alert.onset}</p>
          </div>
          <div>
            {alert.severity === 'CRITICAL' || alert.hazard === 'Heavy Rain' ? (
              <>
                <p className="flex items-center gap-1 text-slate-500"><Users size={11} /> Population</p>
                <p className="num font-semibold text-slate-100">~{fmtInt(alert.population)}</p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-1 text-slate-500"><Zap size={11} /> Lightning</p>
                <p className="num font-semibold text-slate-100">{alert.lightningProb}%</p>
              </>
            )}
          </div>
          <div>
            <p className="flex items-center gap-1 text-slate-500"><Gauge size={11} /> Confidence</p>
            <p className="num font-semibold text-slate-100">{alert.confidence}%</p>
          </div>
        </div>

        {!compact && (
          <div className="mt-3 flex flex-wrap gap-2">
            {alert.severity === 'CRITICAL' ? (
              <>
                <button className="btn-ghost !py-1 !text-xs" onClick={() => { focusMap(alert.center, 10.5); navigate('/app/overview'); toast('Showing alert area on map', 'info', alert.location); }}>
                  <MapIcon size={13} /> View on Map
                </button>
                <button className="btn-danger !py-1 !text-xs" onClick={() => setActiveAlertId(alert.id)}>
                  <Megaphone size={13} /> Issue Alert
                </button>
              </>
            ) : (
              <button className="btn-ghost !py-1 !text-xs" onClick={() => setActiveAlertId(alert.id)}>
                View Details <ChevronRight size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

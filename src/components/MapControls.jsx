import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layers, Radar, Satellite, Zap, ShieldAlert, Navigation, RadioTower, Wind, CloudRain, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { DBZ_SCALE } from '../data/radarData.js';
import { RISK_LEVELS } from '../utils/riskCalculator.js';
import { cx } from '../utils/formatters.js';

export const LAYER_DEFS = [
  { key: 'radar', label: 'Radar Reflectivity', icon: Radar, hint: 'DWR composite Z (dBZ)' },
  { key: 'satellite', label: 'Satellite IR', icon: Satellite, hint: 'INSAT-3D TIR-1 cloud tops' },
  { key: 'lightning', label: 'Lightning', icon: Zap, hint: 'LLN strokes, last 30 min' },
  { key: 'risk', label: 'Risk Zones', icon: ShieldAlert, hint: 'Nowcast hazard polygons' },
  { key: 'prediction', label: 'Prediction Track', icon: Navigation, hint: '+30 min motion cone' },
  { key: 'coverage', label: 'Radar Coverage', icon: RadioTower, hint: 'Station range rings' },
  { key: 'wind', label: 'Wind Vectors', icon: Wind, hint: '10 m wind / outflow' },
  { key: 'rainfall', label: 'Rainfall', icon: CloudRain, hint: 'Rain rate (mm/h)' },
];

export function MapLayerControl({ className, defaultOpen = true }) {
  const { layers, toggleLayer } = useApp();
  const [open, setOpen] = useState(defaultOpen);
  const activeCount = Object.values(layers).filter(Boolean).length;
  return (
    <div className={cx('panel-glass w-[210px] overflow-hidden', className)}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-3 py-2 text-left" aria-expanded={open}>
        <span className="flex items-center gap-2 text-[12px] font-semibold text-slate-100">
          <Layers size={14} className="text-cyan-300" /> Map Layers
          <span className="num rounded bg-white/5 px-1.5 text-[10px] text-slate-400">{activeCount}/8</span>
        </span>
        <ChevronDown size={14} className={cx('text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-line">
            {LAYER_DEFS.map(({ key, label, icon: Icon, hint }) => (
              <li key={key}>
                <button
                  onClick={() => toggleLayer(key, label)}
                  className="group flex w-full items-center gap-2.5 px-3 py-[7px] text-left hover:bg-white/[0.04]"
                  title={hint}
                  aria-pressed={layers[key]}
                >
                  <span className={cx('grid h-3.5 w-3.5 place-items-center rounded-[3px] border', layers[key] ? 'border-cyan-400 bg-cyan-400 text-ink-950' : 'border-slate-500')}>
                    {layers[key] && <Check size={10} strokeWidth={3.5} />}
                  </span>
                  <Icon size={13} className={layers[key] ? 'text-cyan-300' : 'text-slate-500'} />
                  <span className={cx('text-[12px]', layers[key] ? 'text-slate-100' : 'text-slate-400')}>{label}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MapLegend({ className, compact = false }) {
  const { layers } = useApp();
  return (
    <div className={cx('panel-glass space-y-2 px-3 py-2.5', className)}>
      {layers.radar && (
        <div>
          <p className="kicker mb-1 !text-[9.5px]">Reflectivity · dBZ</p>
          <div className="flex">
            {DBZ_SCALE.map((d) => (
              <div key={d.dbz} className="flex flex-col items-center">
                <span className="h-2 w-7" style={{ background: d.color }} />
                <span className="num mt-0.5 text-[9px] text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {!compact && layers.risk && (
        <div>
          <p className="kicker mb-1 !text-[9.5px]">Risk zones</p>
          <div className="flex flex-wrap gap-x-2.5 gap-y-1">
            {Object.values(RISK_LEVELS).map((l) => (
              <span key={l.key} className="flex items-center gap-1 text-[10px] text-slate-300">
                <span className="h-2 w-2 rounded-sm" style={{ background: l.color }} /> {l.label}
              </span>
            ))}
          </div>
        </div>
      )}
      {!compact && layers.lightning && (
        <div className="flex items-center gap-3 text-[10px] text-slate-300">
          <span className="flex items-center gap-1"><Zap size={11} className="fill-yellow-300 text-yellow-300" /> &lt;10 min</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-400" /> 10–20</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-700" /> 20–30</span>
        </div>
      )}
    </div>
  );
}

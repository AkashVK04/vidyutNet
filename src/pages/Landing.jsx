import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, Satellite, Zap, BrainCircuit, MapPinned, ArrowRight, Compass, Merge, Siren, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Logo } from '../components/Header.jsx';
import { StatusDot } from '../components/ui.jsx';
import { ROLES } from '../data/systemData.js';
import { cx } from '../utils/formatters.js';

const FEATURES = [
  { icon: Radar, label: 'Radar' },
  { icon: Satellite, label: 'Satellite' },
  { icon: Zap, label: 'Lightning' },
  { icon: BrainCircuit, label: 'AI Nowcasting' },
  { icon: MapPinned, label: 'Hyperlocal Alerts' },
];

const FLOW = [
  { icon: Radar, title: 'Multi-source data', text: 'Doppler radar, INSAT-3D/3DR imagery and lightning location network' },
  { icon: Merge, title: 'Data fusion', text: 'Quality control and regridding onto a common 1 km grid every 10 min' },
  { icon: BrainCircuit, title: 'AI nowcasting', text: 'Spatiotemporal deep learning extrapolates storm growth and motion' },
  { icon: MapPinned, title: 'Hyperlocal risk', text: 'Lightning, rain and severe-weather probability for every village' },
  { icon: Siren, title: 'Early warning', text: 'Impact-based alerts with 45–60 min lead time, in local languages' },
  { icon: ShieldCheck, title: 'Action', text: 'DDMA, utilities, airports, railways and the public act before impact' },
];

function RadarScope() {
  const blips = [
    { x: 38, y: 60, r: 9, c: '#ef4444' }, { x: 46, y: 53, r: 6, c: '#f97316' }, { x: 62, y: 38, r: 5, c: '#facc15' },
    { x: 28, y: 36, r: 4, c: '#22c55e' }, { x: 70, y: 66, r: 3.5, c: '#22c55e' },
  ];
  return (
    <div className="relative aspect-square w-full max-w-[420px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="scopeBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0b2342" />
            <stop offset="100%" stopColor="#050b17" />
          </radialGradient>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.45" />
          </linearGradient>
          <filter id="blur"><feGaussianBlur stdDeviation="1.6" /></filter>
        </defs>
        <circle cx="50" cy="50" r="49" fill="url(#scopeBg)" stroke="rgba(34,211,238,0.35)" strokeWidth="0.4" />
        {[12, 24, 36, 48].map((r) => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(34,211,238,0.14)" strokeWidth="0.3" />)}
        <line x1="50" y1="1" x2="50" y2="99" stroke="rgba(34,211,238,0.1)" strokeWidth="0.3" />
        <line x1="1" y1="50" x2="99" y2="50" stroke="rgba(34,211,238,0.1)" strokeWidth="0.3" />
        {blips.map((b, i) => (
          <g key={i} filter="url(#blur)">
            <ellipse cx={b.x} cy={b.y} rx={b.r * 1.3} ry={b.r} fill={b.c} opacity="0.35" transform={`rotate(-42 ${b.x} ${b.y})`} />
            <ellipse cx={b.x} cy={b.y} rx={b.r * 0.6} ry={b.r * 0.45} fill={b.c} opacity="0.7" transform={`rotate(-42 ${b.x} ${b.y})`} />
          </g>
        ))}
        <path d="M40 58 L58 40" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
        <path d="M58 40 l-3.2 0.6 l2.6 2.6z" fill="#e2e8f0" />
      </svg>
      <div className="absolute inset-0 animate-sweep" style={{ transformOrigin: '50% 50%' }}>
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path d="M50 50 L99 50 A49 49 0 0 0 84.6 15.4 Z" fill="url(#sweep)" />
        </svg>
      </div>
      {[[37, 58], [44, 55], [41, 62], [48, 52]].map(([x, y], i) => (
        <motion.span key={i} className="absolute" style={{ left: `${x}%`, top: `${y}%` }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 + i * 0.7, delay: i * 0.4 }}>
          <Zap size={14} className="fill-yellow-300 text-yellow-200 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]" />
        </motion.span>
      ))}
      <div className="panel-glass absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 text-[11px]">
        <span className="num text-slate-300">DWR composite · 09:40 IST · </span><span className="text-amber-200">demonstration</span>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { role, setRole, toast } = useApp();
  const exploreRef = useRef(null);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />
        <div className="flex items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/[0.06] px-2.5 py-1.5">
          <StatusDot />
          <span className="font-mono text-[10.5px] font-semibold tracking-wider text-emerald-300">SYSTEM STATUS: OPERATIONAL</span>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-6 md:grid-cols-[1.15fr_1fr] md:pt-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="kicker text-cyan-300/90">Smart India Hackathon 2026 · Problem Statement SIH26072</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Vidyut<span className="text-cyan-300">Net</span>
          </h1>
          <p className="mt-2 text-lg font-medium text-slate-200 sm:text-xl">AI-Powered Hyperlocal Weather Nowcasting &amp; Early Warning System</p>
          <p className="mt-3 max-w-xl text-[15px] text-slate-400">“From atmospheric data to actionable warnings — before the storm arrives.”</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-2.5 py-1.5 text-[12.5px] text-slate-200">
                <f.icon size={14} className="text-cyan-300" /> {f.label}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button onClick={() => { navigate('/app/overview'); toast('Welcome to the Command Center', 'success', 'Demonstration data loaded'); }} className="btn-primary !px-5 !py-2.5 !text-[14px]">
              Open Command Center <ArrowRight size={16} />
            </button>
            <button onClick={() => exploreRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost !px-5 !py-2.5 !text-[14px]">
              <Compass size={16} /> Explore System
            </button>
          </div>

          <div className="mt-5">
            <p className="kicker mb-1.5 !text-[9.5px]">Sign in as (demo access)</p>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => (
                <button key={r.id} onClick={() => setRole(r.id)} className={cx('rounded-full border px-2.5 py-0.5 text-[11.5px]', role === r.id ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-100' : 'border-line text-slate-400 hover:text-white')}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-[12px]">
            <span className="flex items-center gap-2"><StatusDot size="h-1.5 w-1.5" /><span className="font-mono font-semibold tracking-wider text-slate-300">LIVE DATA SOURCES</span></span>
            <span className="text-slate-400">Radar • Satellite • Lightning</span>
            <span className="chip border-amber-400/30 bg-amber-400/10 text-amber-200">Prototype · synthetic data</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex justify-center">
          <RadarScope />
        </motion.div>
      </section>

      <section ref={exploreRef} id="explore" className="border-t border-line bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="kicker text-cyan-300/80">How it works</p>
          <h2 className="mt-1 text-xl font-semibold text-white">From observation to action in under a minute</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {FLOW.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="panel relative p-3.5">
                <span className="num absolute right-3 top-3 text-[10px] text-slate-600">0{i + 1}</span>
                <f.icon size={18} className={i === 5 ? 'text-emerald-300' : i === 4 ? 'text-red-300' : 'text-cyan-300'} />
                <p className="mt-2 text-[13px] font-semibold text-white">{f.title}</p>
                <p className="mt-1 text-[12px] leading-snug text-slate-400">{f.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-slate-500">SIH 2026 | SIH26072 · Frontend prototype — all data shown is synthetic demonstration data.</p>
            <button onClick={() => navigate('/app/overview')} className="btn-primary">Open Command Center <ArrowRight size={14} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}

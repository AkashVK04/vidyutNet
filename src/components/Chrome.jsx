// Layout chrome: simulation banner, secondary nav, mobile nav and footer.
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FlaskConical, LayoutDashboard, Map, Siren, Zap, User, Square } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { NAV } from './Header.jsx';
import { scenario } from '../data/timelineData.js';
import { cx } from '../utils/formatters.js';

export function SimulationBanner() {
  const { demoMode, scenarioRunning, scenarioPhase, stopScenario, toggleDemo } = useApp();
  const phase = scenario.phases[scenarioPhase];
  return (
    <AnimatePresence>
      {demoMode && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-amber-400/25 bg-gradient-to-r from-amber-500/15 via-amber-500/[0.07] to-transparent px-4 py-1.5 text-[12px]">
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider text-amber-300">
              <FlaskConical size={13} /> SIMULATION MODE
            </span>
            <span className="text-amber-100/80">Simulation Mode — Using synthetic demonstration data</span>
            {scenarioRunning && phase && (
              <span className="flex items-center gap-2 text-slate-200">
                <span className="text-amber-400/60">|</span>
                <span className="font-semibold">{scenario.name}</span>
                <span className="num rounded bg-black/30 px-1.5 text-amber-200">{phase.time}</span>
                <span>{phase.title}</span>
              </span>
            )}
            <span className="ml-auto flex gap-2">
              {scenarioRunning && (
                <button onClick={stopScenario} className="flex items-center gap-1 rounded border border-amber-400/30 px-2 py-0.5 text-[11px] text-amber-100 hover:bg-amber-400/10">
                  <Square size={10} /> Stop scenario
                </button>
              )}
              <button onClick={toggleDemo} className="rounded border border-amber-400/30 px-2 py-0.5 text-[11px] text-amber-100 hover:bg-amber-400/10">
                Exit simulation
              </button>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Horizontal nav shown below xl widths (tablet). */
export function SubNav() {
  return (
    <nav className="hidden gap-1 overflow-x-auto border-b border-line bg-ink-950/70 px-3 py-1.5 md:flex xl:hidden" aria-label="Sections">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => cx('flex shrink-0 items-center gap-1.5 rounded px-2.5 py-1 text-[12.5px]', isActive ? 'bg-white/[0.07] text-white' : 'text-slate-400 hover:text-white')}>
          <Icon size={13} /> {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function MobileNav() {
  const { setSettingsOpen } = useApp();
  const items = [
    { to: '/app/overview', label: 'Overview', icon: LayoutDashboard },
    { to: '/app/nowcast', label: 'Map', icon: Map },
    { to: '/app/alerts', label: 'Alerts', icon: Siren },
    { to: '/app/lightning', label: 'Lightning', icon: Zap },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1200] grid grid-cols-5 border-t border-line bg-ink-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Mobile">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => cx('flex flex-col items-center gap-0.5 py-2 text-[10.5px]', isActive ? 'text-cyan-300' : 'text-slate-400')}>
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
      <button onClick={() => setSettingsOpen(true)} className="flex flex-col items-center gap-0.5 py-2 text-[10.5px] text-slate-400">
        <User size={18} />
        Profile
      </button>
    </nav>
  );
}

export function Footer() {
  const { clock } = useApp();
  return (
    <footer className="mt-6 border-t border-line px-4 py-4 text-[11.5px] text-slate-500 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-300">VidyutNet</p>
          <p>AI-Powered Hyperlocal Weather Nowcasting &amp; Early Warning System</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10.5px] uppercase tracking-wider">
          <span>SIH 2026 | SIH26072</span>
          <span>System: Prototype / Demonstration</span>
          <span>Last simulated update: {clock} IST</span>
        </div>
      </div>
      <p className="mt-2 text-[10.5px] text-slate-600">
        All weather data, alerts and metrics shown are synthetic demonstration data. No live IMD feeds or government systems are connected.
      </p>
    </footer>
  );
}

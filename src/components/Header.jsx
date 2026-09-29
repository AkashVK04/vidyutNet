import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CloudLightning, Zap, Siren, Database, BarChart3, MapPin, MonitorPlay, FlaskConical, User } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import NotificationCenter from './NotificationCenter.jsx';
import { LanguageSelector } from './Selectors.jsx';
import { StatusDot, Toggle, Tooltip } from './ui.jsx';
import { ROLES } from '../data/systemData.js';
import { cx } from '../utils/formatters.js';

export const NAV = [
  { to: '/app/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/app/nowcast', label: 'Nowcast', icon: CloudLightning },
  { to: '/app/lightning', label: 'Lightning', icon: Zap },
  { to: '/app/alerts', label: 'Alerts', icon: Siren },
  { to: '/app/data-sources', label: 'Data Sources', icon: Database },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Logo({ size = 30, withText = true, sub = 'AI Weather Intelligence' }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative grid shrink-0 place-items-center rounded-md border border-cyan-400/30 bg-gradient-to-br from-[#0e2340] to-[#07101f]" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size * 0.8} height={size * 0.8} aria-hidden>
          <circle cx="16" cy="16" r="12" fill="none" stroke="#22d3ee" strokeOpacity=".3" strokeWidth="1.2" />
          <circle cx="16" cy="16" r="7" fill="none" stroke="#22d3ee" strokeOpacity=".2" strokeWidth="1" />
          <path d="M17.6 4.5 9.5 17.5h5.8l-1.4 9.5 8.6-13.6h-6.1z" fill="#facc15" />
        </svg>
      </div>
      {withText && (
        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-tight text-white">
            Vidyut<span className="text-cyan-300">Net</span>
          </p>
          <p className="text-[10.5px] text-slate-400">{sub}</p>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { clock, demoMode, toggleDemo, setPresentation, setSettingsOpen, role, toast } = useApp();
  const navigate = useNavigate();
  const roleLabel = ROLES.find((r) => r.id === role)?.label;

  return (
    <header className="fixed inset-x-0 top-0 z-[1200] h-14 border-b border-line bg-ink-950/90 backdrop-blur-md">
      <div className="flex h-full items-center gap-3 px-3 md:px-4">
        <button onClick={() => navigate('/')} className="shrink-0" aria-label="VidyutNet home">
          <Logo />
        </button>

        <nav className="ml-4 hidden flex-1 items-center gap-0.5 xl:flex" aria-label="Main">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cx(
                  'relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                  isActive ? 'bg-white/[0.06] text-white' : 'text-slate-400 hover:text-slate-100',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={14} className={isActive ? 'text-cyan-300' : ''} />
                  {label}
                  {isActive && <span className="absolute inset-x-2.5 -bottom-[11px] h-0.5 rounded-full bg-cyan-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1 xl:hidden" />

        <div className="flex items-center gap-2">
          <Tooltip label={demoMode ? 'Simulation Mode is ON (synthetic data)' : 'Enable Simulation Mode'}>
            <div className={cx('hidden h-8 items-center gap-2 rounded-md border px-2 sm:flex', demoMode ? 'border-amber-400/40 bg-amber-400/10' : 'border-line')}>
              <FlaskConical size={13} className={demoMode ? 'text-amber-300' : 'text-slate-400'} />
              <span className={cx('font-mono text-[10.5px] font-semibold tracking-wider', demoMode ? 'text-amber-200' : 'text-slate-400')}>DEMO</span>
              <Toggle checked={demoMode} onChange={toggleDemo} label="Simulation mode" color="bg-amber-400" />
            </div>
          </Tooltip>

          <Tooltip label="Presentation Mode (for judges)">
            <button
              onClick={() => {
                setPresentation(true);
                toast('Presentation Mode', 'info', 'Press Esc to exit');
              }}
              className="hidden h-8 items-center gap-1.5 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2.5 text-[11px] font-semibold tracking-wide text-cyan-100 hover:bg-cyan-400/20 lg:flex"
            >
              <MonitorPlay size={14} /> <span className="hidden whitespace-nowrap 2xl:inline">PRESENTATION MODE</span><span className="whitespace-nowrap 2xl:hidden">PRESENT</span>
            </button>
          </Tooltip>

          <div className="hidden h-8 items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/[0.07] px-2.5 md:flex" title={demoMode ? 'Simulated live feed' : 'Demonstration snapshot'}>
            <StatusDot />
            <span className="font-mono text-[11px] font-bold tracking-wider text-emerald-300">LIVE</span>
            <span className="num whitespace-nowrap text-[12px] text-slate-200">{clock} IST</span>
          </div>

          <div className="hidden h-8 items-center gap-1 rounded-md border border-line px-2 text-[12px] text-slate-300 min-[1720px]:flex">
            <MapPin size={13} className="text-cyan-300" /> Karnataka
          </div>

          <div className="hidden sm:block">
            <LanguageSelector compact />
          </div>
          <NotificationCenter />

          <button onClick={() => setSettingsOpen(true)} className="flex h-8 items-center gap-2 rounded-md border border-line pl-1 pr-2 hover:bg-white/5" aria-label="Profile and settings">
            <span className="grid h-6 w-6 place-items-center rounded bg-gradient-to-br from-cyan-500/40 to-blue-600/40 text-[10px] font-bold text-white">
              <User size={13} />
            </span>
            <span className="hidden whitespace-nowrap text-left leading-tight 2xl:block">
              <span className="block text-[11.5px] font-semibold text-slate-100">{roleLabel}</span>
              <span className="block text-[10px] text-slate-500">Ramanagara EOC</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

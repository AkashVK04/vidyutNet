import { motion } from 'framer-motion';
import { cx } from '../utils/formatters.js';
import { RISK_LEVELS, SEVERITY } from '../utils/riskCalculator.js';

export function Panel({ title, kicker, icon: Icon, actions, children, className, bodyClass, id }) {
  return (
    <section id={id} className={cx('panel flex min-w-0 flex-col', className)}>
      {(title || kicker) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            {Icon && <Icon size={15} className="shrink-0 text-cyan-300/80" />}
            <div className="min-w-0">
              {kicker && <p className="kicker leading-none">{kicker}</p>}
              {title && <h3 className="truncate text-[13px] font-semibold text-slate-100">{title}</h3>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className={cx('min-h-0 flex-1', bodyClass ?? 'p-3.5')}>{children}</div>
    </section>
  );
}

export function StatusDot({ color = 'bg-emerald-400', pulse = true, size = 'h-2 w-2' }) {
  return (
    <span className={cx('relative inline-flex shrink-0', size)}>
      {pulse && <span className={cx('absolute inset-0 rounded-full animate-ping2', color)} />}
      <span className={cx('relative inline-flex rounded-full', size, color)} />
    </span>
  );
}

export function LevelBadge({ level, className, children }) {
  const l = typeof level === 'string' ? RISK_LEVELS[level] || RISK_LEVELS.LOW : level;
  return <span className={cx('chip', l.text, l.bg, l.border, className)}>{children || l.key}</span>;
}

export function SeverityBadge({ severity, className }) {
  const s = SEVERITY[severity] || SEVERITY.MODERATE;
  return (
    <span className={cx('chip', s.text, s.bg, s.border, className)}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {severity}
    </span>
  );
}

export function DemoTag({ className, children = 'Demonstration Data' }) {
  return <span className={cx('chip border-amber-400/30 bg-amber-400/10 text-amber-200/90', className)}>{children}</span>;
}

export function ProbBar({ value, color = '#22d3ee', className }) {
  return (
    <div className={cx('h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]', className)}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={false}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

export function Stat({ label, value, sub, className, valueClass }) {
  return (
    <div className={cx('min-w-0', className)}>
      <p className="kicker truncate">{label}</p>
      <p className={cx('num mt-1 truncate text-sm font-semibold text-slate-100', valueClass)}>{value}</p>
      {sub && <p className="mt-0.5 truncate text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
}

export function Tooltip({ label, children, side = 'bottom' }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cx(
          'pointer-events-none absolute left-1/2 z-[2000] -translate-x-1/2 whitespace-nowrap rounded border border-white/10 bg-ink-800 px-2 py-1 text-[11px] font-medium text-slate-200 opacity-0 shadow-lg transition-opacity delay-150 group-hover:opacity-100 group-focus-within:opacity-100',
          side === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
        )}
      >
        {label}
      </span>
    </span>
  );
}

export function Skeleton({ className }) {
  return (
    <div className={cx('relative overflow-hidden rounded bg-white/[0.04]', className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

export function Toggle({ checked, onChange, label, color = 'bg-cyan-400' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cx('relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full border transition-colors', checked ? `${color} border-transparent` : 'border-line bg-white/[0.06]')}
    >
      <span className={cx('inline-block h-3 w-3 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-[15px]' : 'translate-x-[2px]')} />
    </button>
  );
}

export function PageHeader({ kicker, title, subtitle, actions }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker && <p className="kicker text-cyan-300/80">{kicker}</p>}
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-white md:text-[22px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

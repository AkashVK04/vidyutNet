import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Languages, ChevronDown, Check, UserCog } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { LANGUAGES } from '../data/translations.js';
import { ROLES } from '../data/systemData.js';
import { useClickOutside } from '../hooks/useClickOutside.js';
import { cx } from '../utils/formatters.js';

function Dropdown({ button, children, open, setOpen, align = 'right', width = 'w-52' }) {
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), [setOpen]);
  useClickOutside(ref, close, open);
  return (
    <div className="relative" ref={ref}>
      {button}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cx('panel-glass absolute top-10 z-[1500] overflow-hidden py-1', width, align === 'right' ? 'right-0' : 'left-0')}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LanguageSelector({ compact = false }) {
  const { lang, setLang, toast } = useApp();
  const [open, setOpen] = useState(false);
  const cur = LANGUAGES.find((l) => l.code === lang);
  return (
    <Dropdown
      open={open}
      setOpen={setOpen}
      width="w-44"
      button={
        <button onClick={() => setOpen((o) => !o)} className="flex h-8 items-center gap-1.5 rounded-md border border-line px-2 text-[12px] text-slate-300 hover:bg-white/5 hover:text-white" title="Alert language" aria-label="Alert language">
          <Languages size={14} />
          {!compact && <span className={cur.font}>{cur.native}</span>}
          <ChevronDown size={12} className="text-slate-500" />
        </button>
      }
    >
      <p className="kicker px-3 pb-1 pt-1.5">Alert language</p>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => {
            setLang(l.code);
            setOpen(false);
            toast('Alert language changed', 'info', `${l.native} · demonstration translation`);
          }}
          className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[13px] hover:bg-white/5"
        >
          <span className={cx(l.font, lang === l.code ? 'text-cyan-200' : 'text-slate-200')}>{l.native}</span>
          <span className="flex items-center gap-2 text-[11px] text-slate-500">
            {l.label !== l.native && l.label}
            {lang === l.code && <Check size={13} className="text-cyan-300" />}
          </span>
        </button>
      ))}
    </Dropdown>
  );
}

export function RoleSelector({ className }) {
  const { role, setRole, toast } = useApp();
  const [open, setOpen] = useState(false);
  const cur = ROLES.find((r) => r.id === role);
  return (
    <Dropdown
      open={open}
      setOpen={setOpen}
      align="left"
      width="w-64"
      button={
        <button onClick={() => setOpen((o) => !o)} className={cx('flex h-8 items-center gap-2 rounded-md border border-line bg-white/[0.02] px-2.5 text-[12px] text-slate-200 hover:bg-white/5', className)} aria-label="Stakeholder view">
          <UserCog size={14} className="text-cyan-300" />
          <span className="text-slate-400">View:</span>
          <span className="font-semibold">{cur.label}</span>
          <ChevronDown size={12} className="text-slate-500" />
        </button>
      }
    >
      <p className="kicker px-3 pb-1 pt-1.5">Stakeholder mode</p>
      {ROLES.map((r) => (
        <button
          key={r.id}
          onClick={() => {
            setRole(r.id);
            setOpen(false);
            toast(`${r.label} view`, 'info', r.focus);
          }}
          className="flex w-full items-start justify-between gap-2 px-3 py-2 text-left hover:bg-white/5"
        >
          <span>
            <span className={cx('block text-[13px]', role === r.id ? 'text-cyan-200' : 'text-slate-100')}>{r.label}</span>
            <span className="block text-[11px] text-slate-500">{r.focus}</span>
          </span>
          {role === r.id && <Check size={14} className="mt-0.5 text-cyan-300" />}
        </button>
      ))}
    </Dropdown>
  );
}

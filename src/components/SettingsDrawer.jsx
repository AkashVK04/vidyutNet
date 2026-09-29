import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, User, LogOut, MonitorPlay, Megaphone, Info } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { RoleSelector, LanguageSelector } from './Selectors.jsx';
import SystemHealth from './SystemHealth.jsx';
import { Toggle } from './ui.jsx';
import { cx } from '../utils/formatters.js';

export default function SettingsDrawer() {
  const { settingsOpen, setSettingsOpen, demoMode, toggleDemo, setPresentation, toast } = useApp();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState('10');
  const [units, setUnits] = useState('metric');
  const [sound, setSound] = useState(false);
  const close = () => setSettingsOpen(false);

  return createPortal(
    <AnimatePresence>
      {settingsOpen && (
        <motion.div className="fixed inset-0 z-[2400]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <motion.aside
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            className="absolute inset-y-0 right-0 flex w-[360px] max-w-full flex-col border-l border-line bg-ink-900"
            aria-label="Settings and system status"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-[14px] font-semibold text-white">Settings &amp; System Status</p>
              <button onClick={close} className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close settings"><X size={17} /></button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-cyan-500/40 to-blue-600/40 text-white"><User size={20} /></span>
                <div>
                  <p className="text-[14px] font-semibold text-white">Demo Operator</p>
                  <p className="text-[12px] text-slate-400">District Disaster Management Authority · Ramanagara EOC</p>
                  <p className="text-[11px] text-amber-200/70">Prototype account (no authentication)</p>
                </div>
              </div>

              <section className="space-y-2.5">
                <p className="kicker">Workspace</p>
                <div className="flex items-center justify-between"><span className="text-[13px] text-slate-300">Stakeholder view</span><RoleSelector /></div>
                <div className="flex items-center justify-between"><span className="text-[13px] text-slate-300">Alert language</span><LanguageSelector /></div>
                <div className="flex items-center justify-between"><span className="text-[13px] text-slate-300">Simulation Mode</span><Toggle checked={demoMode} onChange={toggleDemo} label="Simulation mode" color="bg-amber-400" /></div>
                <div className="flex items-center justify-between"><span className="text-[13px] text-slate-300">Audible alert tone</span><Toggle checked={sound} onChange={() => { setSound((s) => !s); toast(sound ? 'Alert tone off' : 'Alert tone on', 'info'); }} label="Alert tone" /></div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-slate-300">Nowcast refresh</span>
                  <div className="flex gap-1">
                    {['5', '10', '15'].map((r) => (
                      <button key={r} onClick={() => { setRefresh(r); toast('Refresh interval updated', 'info', `${r} minutes (display only)`); }} className={cx('num rounded border px-2 py-0.5 text-[12px]', refresh === r ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-100' : 'border-line text-slate-400')}>{r}m</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-slate-300">Units</span>
                  <div className="flex gap-1">
                    {['metric', 'aviation'].map((u) => (
                      <button key={u} onClick={() => setUnits(u)} className={cx('rounded border px-2 py-0.5 text-[12px] capitalize', units === u ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-100' : 'border-line text-slate-400')}>{u}</button>
                    ))}
                  </div>
                </div>
              </section>

              <SystemHealth />

              <section className="space-y-2">
                <p className="kicker">Quick actions</p>
                <button className="btn-ghost w-full justify-start" onClick={() => { close(); setPresentation(true); }}><MonitorPlay size={14} /> Presentation Mode</button>
                <button className="btn-ghost w-full justify-start" onClick={() => { close(); navigate('/public'); }}><Megaphone size={14} /> Open Public Warning Screen</button>
                <button className="btn-ghost w-full justify-start" onClick={() => { close(); navigate('/'); }}><LogOut size={14} /> Exit to landing page</button>
              </section>

              <section className="rounded-md border border-amber-400/20 bg-amber-400/[0.05] p-3 text-[11.5px] leading-relaxed text-amber-100/80">
                <p className="mb-1 flex items-center gap-1.5 font-semibold text-amber-200"><Info size={13} /> About this prototype</p>
                VidyutNet is a frontend demonstration for SIH 2026 (SIH26072). All radar, satellite, lightning, forecast and alert data are synthetic. No IMD or government systems are connected, and no messages are sent.
              </section>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

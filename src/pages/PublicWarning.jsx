import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TriangleAlert, MapPin, Clock, Zap, Home, School, Landmark, ArrowLeft, CheckCircle2, ShieldCheck, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { LANGUAGES, publicStrings, safeLocationsByLang } from '../data/translations.js';
import { Logo } from '../components/Header.jsx';
import { cx } from '../utils/formatters.js';

const SAFE_ICONS = [Home, School, Landmark];
const SAFE_DIST = ['0.4 km', '0.7 km', '1.1 km'];

export default function PublicWarning({ embedded = false }) {
  const { lang, setLang, toast, clock } = useApp();
  const navigate = useNavigate();
  const [ack, setAck] = useState(false);
  const s = publicStrings[lang] || publicStrings.en;
  const meta = LANGUAGES.find((l) => l.code === lang);
  const safe = safeLocationsByLang[lang] || safeLocationsByLang.en;

  const body = (
    <div className={cx('mx-auto w-full max-w-3xl', meta.font)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Warning language">
          {LANGUAGES.map((l) => (
            <button key={l.code} role="tab" aria-selected={lang === l.code} onClick={() => setLang(l.code)}
              className={cx('rounded-md border px-2.5 py-1 text-[13px]', l.font, lang === l.code ? 'border-cyan-400/50 bg-cyan-400/15 text-white' : 'border-line text-slate-400 hover:text-white')}>
              {l.native}
            </button>
          ))}
        </div>
        <span className="chip border-amber-400/30 bg-amber-400/10 font-sans text-amber-200">Demonstration · public view</span>
      </div>

      <motion.div layout className="overflow-hidden rounded-xl border-2 border-red-500/60 bg-gradient-to-b from-red-600/25 via-red-900/10 to-ink-900 shadow-[0_0_60px_-10px_rgba(239,68,68,0.45)]">
        <div className="relative flex items-center gap-3 bg-red-600 px-5 py-4 text-white">
          <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
            <TriangleAlert size={38} strokeWidth={2.4} />
          </motion.span>
          <AnimatePresence mode="wait">
            <motion.h1 key={lang} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-[22px] font-extrabold uppercase leading-tight tracking-wide sm:text-[28px]">
              {s.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.p key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[18px] font-semibold leading-snug text-white sm:text-[21px]">
              {s.message}
            </motion.p>
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {[
              [MapPin, s.location, 'Ramanagara'],
              [Clock, s.expected, s.within15],
              [Zap, s.lightningProb, '87%'],
            ].map(([I, k, v]) => (
              <div key={k} className="rounded-lg border border-white/10 bg-black/25 px-4 py-3">
                <p className="flex items-center gap-1.5 text-[12px] text-slate-300"><I size={14} /> {k}</p>
                <p className="mt-1 text-[22px] font-bold text-white">{v}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3.5">
            <p className="text-[18px] font-bold leading-snug text-amber-100">{s.action}</p>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-300">{s.safe}</p>
            <ul className="grid gap-2 sm:grid-cols-3">
              {safe.map((name, i) => {
                const I = SAFE_ICONS[i];
                return (
                  <li key={name} className="flex items-center gap-3 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.07] px-3 py-2.5">
                    <I size={20} className="shrink-0 text-emerald-300" />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-white">{name}</p>
                      <p className="flex items-center gap-1 font-sans text-[11.5px] text-emerald-200/80"><Navigation size={10} /> {SAFE_DIST[i]}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-300">{s.tipsTitle}</p>
            <ul className="grid gap-1.5 text-[14px] text-slate-200 sm:grid-cols-2">
              {s.tips.map((t) => (
                <li key={t} className="flex items-start gap-2"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-cyan-300" /> {t}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => {
              setAck(true);
              toast('Warning acknowledged', 'success', 'Public acknowledgement recorded (simulated)');
            }}
            disabled={ack}
            className={cx('flex w-full items-center justify-center gap-2 rounded-lg py-4 text-[20px] font-extrabold tracking-wider transition-colors', ack ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white text-ink-950 hover:bg-slate-200')}
          >
            {ack ? <><CheckCircle2 size={22} /> ✓ {s.understood}</> : s.understood}
          </button>
          <p className="text-center font-sans text-[11px] text-slate-500">
            {s.issued} {clock} IST · VidyutNet prototype · demonstration translation — verify before operational use
          </p>
        </div>
      </motion.div>
    </div>
  );

  if (embedded) return <div className="py-2">{body}</div>;

  return (
    <div className="min-h-screen bg-ink-950 px-4 pb-10 pt-4">
      <div className="mx-auto mb-5 flex max-w-3xl items-center justify-between">
        <Logo sub="Public Warning" />
        <button className="btn-ghost" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/app/overview'))}><ArrowLeft size={14} /> Back</button>
      </div>
      {body}
    </div>
  );
}

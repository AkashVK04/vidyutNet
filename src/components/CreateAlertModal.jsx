import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Send, RotateCcw, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import Modal from './Modal.jsx';
import { HAZARD_TYPES, SEVERITIES, LEAD_TIMES, TARGET_GROUPS, ALERT_LOCATIONS } from '../data/alertsData.js';
import { SEVERITY } from '../utils/riskCalculator.js';
import { cx, fmtInt } from '../utils/formatters.js';
import { SeverityBadge } from './ui.jsx';
import { HAZARD_ICON } from './AlertCard.jsx';

const TITLES = {
  Thunderstorm: 'Thunderstorm Warning',
  Lightning: 'Lightning Warning',
  'Heavy Rain': 'Heavy Rain Warning',
  'Severe Weather': 'Severe Weather Warning',
};

function defaultMessage(hazard, location, lead) {
  return `${hazard} expected over ${location} within ${lead} minutes. Move indoors, avoid open areas and stay away from trees and power lines.`;
}

const INITIAL = { hazard: 'Thunderstorm', severity: 'HIGH', location: ALERT_LOCATIONS[0].name, lead: 30, targets: ['DDMA', 'Village', 'Public'], message: '' };

export default function CreateAlertModal() {
  const { createAlertOpen, setCreateAlertOpen, addAlert, toast, pushNotification, clock, setActiveAlertId } = useApp();
  const [form, setForm] = useState(INITIAL);
  const [stage, setStage] = useState('form'); // form | preview | done
  const [created, setCreated] = useState(null);

  const loc = ALERT_LOCATIONS.find((l) => l.name === form.location);
  const message = form.message || defaultMessage(form.hazard, form.location, form.lead);
  const Icon = HAZARD_ICON[form.hazard];
  const sev = SEVERITY[form.severity];
  const estPop = Math.round(loc.radiusKm * loc.radiusKm * 38);

  const close = () => {
    setCreateAlertOpen(false);
    setTimeout(() => {
      setStage('form');
      setForm(INITIAL);
      setCreated(null);
    }, 250);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTarget = (t) => set('targets', form.targets.includes(t) ? form.targets.filter((x) => x !== t) : [...form.targets, t]);

  const generate = () => {
    const a = addAlert({
      severity: form.severity,
      hazard: form.hazard,
      title: TITLES[form.hazard],
      location: form.location,
      center: loc.center,
      radiusKm: loc.radiusKm,
      summary: message,
      onset: `${form.lead} minutes`,
      confidence: 80 + Math.round(Math.random() * 10),
      population: estPop,
      lightningProb: form.hazard === 'Heavy Rain' ? 55 : 78,
      villages: ['(operator-defined area)'],
      actions: ['Move people indoors', 'Suspend outdoor activities', 'Warn schools and public facilities', 'Notify emergency response teams'],
      targets: form.targets,
      generated: true,
    });
    setCreated(a);
    setStage('done');
    toast('Alert generated successfully', 'success', 'Prototype Alert Generated Successfully');
    pushNotification({ time: clock, title: `Prototype alert generated: ${a.title}`, detail: a.location, type: 'warning' });
  };

  return (
    <Modal open={createAlertOpen} onClose={close} title="Create Alert" width="max-w-2xl" kicker={<span className="chip border-cyan-400/25 bg-cyan-400/10 text-cyan-200">Alert creation simulation</span>}>
      <AnimatePresence mode="wait" initial={false}>
        {stage === 'form' && (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.targets.length) {
                toast('Select at least one target group', 'warning');
                return;
              }
              setStage('preview');
            }}
            className="space-y-4 p-5"
          >
            <fieldset>
              <legend className="kicker mb-1.5">Hazard type</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {HAZARD_TYPES.map((h) => {
                  const HI = HAZARD_ICON[h];
                  return (
                    <button type="button" key={h} onClick={() => set('hazard', h)} className={cx('flex items-center gap-2 rounded-md border px-2.5 py-2 text-[12.5px]', form.hazard === h ? 'border-cyan-400/50 bg-cyan-400/10 text-white' : 'border-line text-slate-300 hover:bg-white/[0.03]')}>
                      <HI size={14} className={form.hazard === h ? 'text-cyan-300' : 'text-slate-500'} /> {h}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="kicker mb-1.5">Severity</legend>
              <div className="grid grid-cols-3 gap-2">
                {SEVERITIES.map((s) => (
                  <button type="button" key={s} onClick={() => set('severity', s)} className={cx('rounded-md border px-2.5 py-2 text-[12px] font-semibold tracking-wide', form.severity === s ? `${SEVERITY[s].border} ${SEVERITY[s].bg} ${SEVERITY[s].text}` : 'border-line text-slate-400 hover:bg-white/[0.03]')}>
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="kicker mb-1.5 block">Location</span>
                <select className="field" value={form.location} onChange={(e) => set('location', e.target.value)}>
                  {ALERT_LOCATIONS.map((l) => (
                    <option key={l.name} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </label>
              <div>
                <span className="kicker mb-1.5 block">Lead time</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {LEAD_TIMES.map((l) => (
                    <button type="button" key={l} onClick={() => set('lead', l)} className={cx('num rounded-md border py-2 text-[12px]', form.lead === l ? 'border-cyan-400/50 bg-cyan-400/10 text-white' : 'border-line text-slate-400 hover:bg-white/[0.03]')}>
                      {l} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="block">
              <span className="kicker mb-1.5 block">Message</span>
              <textarea className="field min-h-[84px] resize-y" placeholder={defaultMessage(form.hazard, form.location, form.lead)} value={form.message} onChange={(e) => set('message', e.target.value)} maxLength={320} />
              <span className="mt-1 block text-right text-[10.5px] text-slate-500">{message.length}/320 · leave empty to use the suggested text</span>
            </label>

            <fieldset>
              <legend className="kicker mb-1.5">Target</legend>
              <div className="flex flex-wrap gap-1.5">
                {TARGET_GROUPS.map((t) => (
                  <button type="button" key={t} onClick={() => toggleTarget(t)} className={cx('rounded-full border px-3 py-1 text-[12px]', form.targets.includes(t) ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-100' : 'border-line text-slate-400 hover:text-white')} aria-pressed={form.targets.includes(t)}>
                    {form.targets.includes(t) ? '✓ ' : ''}{t}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex justify-end gap-2 border-t border-line pt-4">
              <button type="button" className="btn-ghost" onClick={close}>Cancel</button>
              <button type="submit" className="btn-primary"><Eye size={14} /> Preview Alert</button>
            </div>
          </motion.form>
        )}

        {stage === 'preview' && (
          <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4 p-5">
            <p className="kicker">Generated alert preview</p>
            <div className="relative overflow-hidden rounded-lg border bg-white/[0.02] p-4" style={{ borderColor: `${sev.color}66` }}>
              <span className="absolute inset-y-0 left-0 w-1" style={{ background: sev.color }} />
              <div className="flex items-center justify-between">
                <SeverityBadge severity={form.severity} />
                <span className="num text-[11px] text-slate-500">Draft · {clock} IST</span>
              </div>
              <h3 className="mt-2 flex items-center gap-2 text-[15px] font-bold uppercase tracking-wide text-white">
                <Icon size={16} style={{ color: sev.color }} /> {TITLES[form.hazard]}
              </h3>
              <p className="text-[13px] font-medium text-slate-200">{form.location}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{message}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11.5px]">
                <div><p className="text-slate-500">Expected onset</p><p className="num font-semibold text-slate-100">{form.lead} min</p></div>
                <div><p className="text-slate-500">Est. population</p><p className="num font-semibold text-slate-100">~{fmtInt(estPop)}</p></div>
                <div><p className="text-slate-500">Targets</p><p className="font-semibold text-slate-100">{form.targets.join(', ')}</p></div>
              </div>
            </div>
            <p className="text-[11.5px] text-amber-200/80">Prototype: generating this alert will not send any SMS, push, or API requests.</p>
            <div className="flex justify-end gap-2 border-t border-line pt-4">
              <button className="btn-ghost" onClick={() => setStage('form')}><RotateCcw size={14} /> Edit</button>
              <button className="btn-primary" onClick={generate}><Sparkles size={14} /> Generate Alert</button>
            </div>
          </motion.div>
        )}

        {stage === 'done' && created && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 16 }} className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
              <CheckCircle2 size={30} />
            </motion.div>
            <h3 className="mt-4 text-lg font-semibold text-white">Prototype Alert Generated Successfully</h3>
            <p className="num mt-1 text-[12px] text-slate-400">{created.id} · {created.title} · {created.location}</p>
            <p className="mx-auto mt-2 max-w-md text-[12.5px] text-slate-400">The alert has been added to the Early Warning Center. No messages were transmitted — this is a frontend simulation.</p>
            <div className="mt-5 flex justify-center gap-2">
              <button className="btn-ghost" onClick={() => { setStage('form'); setForm(INITIAL); }}>Create another</button>
              <button className="btn-primary" onClick={() => { const id = created.id; close(); setTimeout(() => setActiveAlertId(id), 280); }}>
                <Send size={14} /> Open alert
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

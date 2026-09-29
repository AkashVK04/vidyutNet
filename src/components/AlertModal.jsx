import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, Polygon, TileLayer, CircleMarker, Tooltip as LTooltip } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Megaphone, CheckCircle2, Map as MapIcon, Download, Check, Loader2, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import Modal from './Modal.jsx';
import { SeverityBadge } from './ui.jsx';
import { SEVERITY } from '../utils/riskCalculator.js';
import { alertGeoJSON, alertPolygon, downloadJSON } from '../utils/alertGeometry.js';
import { villages } from '../data/villagesData.js';
import { disseminationChannels } from '../data/alertsData.js';
import { publicStrings, LANGUAGES } from '../data/translations.js';
import { fmtInt, cx } from '../utils/formatters.js';

function Info({ label, value, accent }) {
  return (
    <div className="rounded-md border border-line bg-white/[0.015] px-3 py-2">
      <p className="kicker !text-[9.5px]">{label}</p>
      <p className={cx('num mt-0.5 text-[13px] font-semibold', accent || 'text-slate-100')}>{value}</p>
    </div>
  );
}

export default function AlertModal() {
  const { alerts, activeAlertId, setActiveAlertId, acknowledgeAlert, focusMap, toast, pushNotification, clock, lang, setLang } = useApp();
  const navigate = useNavigate();
  const alert = alerts.find((a) => a.id === activeAlertId);
  const [broadcast, setBroadcast] = useState({ state: 'idle', done: 0 });
  const [checked, setChecked] = useState({});

  useEffect(() => {
    setBroadcast({ state: 'idle', done: 0 });
    setChecked({});
  }, [activeAlertId]);

  useEffect(() => {
    if (broadcast.state !== 'sending') return undefined;
    if (broadcast.done >= disseminationChannels.length) {
      setBroadcast((b) => ({ ...b, state: 'sent' }));
      toast('Alert broadcast simulated', 'success', 'Prototype only — no SMS or API messages were sent');
      pushNotification({ time: clock, title: `Broadcast simulated: ${alert?.title}`, detail: alert?.location, type: 'ok' });
      return undefined;
    }
    const id = setTimeout(() => setBroadcast((b) => ({ ...b, done: b.done + 1 })), 450);
    return () => clearTimeout(id);
  }, [broadcast, toast, pushNotification, clock, alert]);

  const poly = useMemo(() => (alert ? alertPolygon(alert) : []), [alert]);
  const vPoints = useMemo(() => (alert ? villages.filter((v) => alert.villages.includes(v.name)) : []), [alert]);

  if (!alert) return <Modal open={false} onClose={() => {}} title="" />;
  const sev = SEVERITY[alert.severity];
  const acked = alert.status === 'acknowledged';
  const str = publicStrings[lang] || publicStrings.en;
  const langMeta = LANGUAGES.find((l) => l.code === lang);

  return (
    <Modal
      open={!!alert}
      onClose={() => setActiveAlertId(null)}
      title={alert.title}
      width="max-w-4xl"
      kicker={
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={alert.severity} />
          <span className="num text-[11px] text-slate-500">Alert ID {alert.id}</span>
          {acked && <span className="chip border-emerald-400/30 bg-emerald-400/10 text-emerald-300">Acknowledged</span>}
          <span className="chip border-amber-400/25 bg-amber-400/10 text-amber-200">Demonstration Data</span>
        </div>
      }
    >
      <div className="grid gap-4 p-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-slate-300">{alert.summary}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Info label="Severity" value={alert.severity} accent={sev.text} />
            <Info label="Hazard type" value={alert.hazard} />
            <Info label="Location" value={alert.location} />
            <Info label="Issued time" value={`${alert.issued} IST`} />
            <Info label="Expected onset" value={alert.onset} accent="text-amber-200" />
            <Info label="Expiry" value={`${alert.expiry} IST`} />
            <Info label="Confidence" value={`${alert.confidence}%`} accent="text-cyan-200" />
            <Info label="Population affected" value={`~${fmtInt(alert.population)}`} />
            <Info label="Lightning probability" value={`${alert.lightningProb}%`} />
          </div>

          <div>
            <p className="kicker mb-1.5">Affected villages / localities</p>
            <div className="flex flex-wrap gap-1.5">
              {alert.villages.map((v) => (
                <span key={v} className="rounded border border-line bg-white/[0.03] px-2 py-0.5 text-[12px] text-slate-200">{v}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="kicker mb-1.5">Recommended actions</p>
            <ul className="space-y-1">
              {alert.actions.map((a) => (
                <li key={a}>
                  <button onClick={() => setChecked((c) => ({ ...c, [a]: !c[a] }))} className="flex w-full items-center gap-2.5 rounded px-1.5 py-1 text-left text-[13px] hover:bg-white/[0.03]">
                    <span className={cx('grid h-4 w-4 shrink-0 place-items-center rounded border', checked[a] ? 'border-emerald-400 bg-emerald-400 text-ink-950' : 'border-slate-500')}>
                      {checked[a] && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span className={checked[a] ? 'text-slate-500 line-through' : 'text-slate-200'}>{a}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-[220px] overflow-hidden rounded-md border border-line">
            <MapContainer key={alert.id} center={alert.center} zoom={9.5} zoomSnap={0.25} className="h-full w-full" zoomControl={false} attributionControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" subdomains="abcd" />
              <Polygon positions={poly} pathOptions={{ color: sev.color, weight: 2, fillColor: sev.color, fillOpacity: 0.2 }} />
              {vPoints.map((v) => (
                <CircleMarker key={v.id} center={v.pos} radius={4} pathOptions={{ color: '#020617', weight: 1.5, fillColor: '#fde68a', fillOpacity: 1 }}>
                  <LTooltip className="vn-tip" permanent direction="right" offset={[5, 0]}>{v.name}</LTooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          <div className="rounded-md border border-line bg-white/[0.015] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="kicker">Public message preview</p>
              <div className="flex gap-1">
                {['en', 'kn'].map((c) => (
                  <button key={c} onClick={() => setLang(c)} className={cx('rounded px-2 py-0.5 text-[11px]', lang === c ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-400 hover:text-white')}>
                    {c === 'en' ? 'English' : 'ಕನ್ನಡ'}
                  </button>
                ))}
              </div>
            </div>
            <p className={cx('text-[13.5px] leading-relaxed text-slate-100', langMeta?.font)}>{str.message}</p>
            <p className="mt-1.5 text-[10.5px] text-slate-500">Demonstration translation · {langMeta?.label}</p>
          </div>

          {broadcast.state !== 'idle' && (
            <div className="rounded-md border border-line bg-white/[0.015] p-3">
              <p className="kicker mb-1.5 flex items-center gap-1.5"><Radio size={12} /> Dissemination (simulated)</p>
              <ul className="space-y-1">
                {disseminationChannels.map((c, i) => (
                  <li key={c.id} className="flex items-center justify-between text-[12px]">
                    <span className="text-slate-300">{c.name}</span>
                    {i < broadcast.done ? (
                      <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-emerald-300"><Check size={13} /> Simulated</motion.span>
                    ) : i === broadcast.done && broadcast.state === 'sending' ? (
                      <Loader2 size={13} className="animate-spin text-cyan-300" />
                    ) : (
                      <span className="text-slate-600">Queued</span>
                    )}
                  </li>
                ))}
              </ul>
              {broadcast.state === 'sent' && <p className="mt-2 text-[11px] text-amber-200/80">Prototype: no real SMS, CAP or API messages were transmitted.</p>}
            </div>
          )}
        </div>
      </div>

      <footer className="sticky bottom-0 flex flex-wrap gap-2 border-t border-line bg-ink-900/95 px-5 py-3 backdrop-blur">
        <button className="btn-danger" disabled={broadcast.state !== 'idle'} onClick={() => setBroadcast({ state: 'sending', done: 0 })}>
          {broadcast.state === 'sending' ? <Loader2 size={14} className="animate-spin" /> : <Megaphone size={14} />}
          {broadcast.state === 'sent' ? 'Broadcast Simulated' : 'Broadcast Alert'}
        </button>
        <button className="btn-ghost" disabled={acked} onClick={() => acknowledgeAlert(alert.id)}>
          <CheckCircle2 size={14} /> {acked ? 'Acknowledged' : 'Mark Acknowledged'}
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            setActiveAlertId(null);
            navigate('/app/overview');
            focusMap(alert.center, 10.5);
            toast('Showing affected area', 'info', alert.location);
          }}
        >
          <MapIcon size={14} /> View Affected Area
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            downloadJSON(alertGeoJSON(alert), `${alert.id}.geojson`);
            toast('GeoJSON downloaded', 'success', `${alert.id}.geojson`);
          }}
        >
          <Download size={14} /> Download GeoJSON
        </button>
      </footer>
    </Modal>
  );
}

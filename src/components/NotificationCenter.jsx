import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Zap, AlertTriangle, Satellite, Radar } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useClickOutside } from '../hooks/useClickOutside.js';
import { cx } from '../utils/formatters.js';

const TYPE = {
  critical: { Icon: Zap, cls: 'text-red-300 bg-red-500/15' },
  warning: { Icon: AlertTriangle, cls: 'text-amber-300 bg-amber-400/15' },
  info: { Icon: Satellite, cls: 'text-cyan-300 bg-cyan-400/15' },
  ok: { Icon: Radar, cls: 'text-emerald-300 bg-emerald-400/15' },
};

export default function NotificationCenter() {
  const { notifications, setNotifications, toast } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-8 w-8 place-items-center rounded-md border border-line text-slate-300 hover:bg-white/5 hover:text-white"
        aria-label={`Notifications (${unread} unread)`}
        title="Notifications"
      >
        <Bell size={15} />
        {unread > 0 && (
          <span className="num absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9.5px] font-bold text-white">{unread}</span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="panel-glass absolute right-0 top-10 z-[1500] w-[340px] max-w-[calc(100vw-1.5rem)] overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
              <p className="text-[13px] font-semibold text-white">Notifications</p>
              <div className="flex gap-1">
                <button
                  className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
                  disabled={!unread}
                  onClick={() => {
                    setNotifications((l) => l.map((n) => ({ ...n, read: true })));
                    toast('All notifications marked as read', 'success');
                  }}
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
                <button
                  className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
                  disabled={!notifications.length}
                  onClick={() => {
                    setNotifications([]);
                    toast('Notifications cleared', 'info');
                  }}
                >
                  <Trash2 size={13} /> Clear all
                </button>
              </div>
            </div>
            <ul className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 && <li className="px-3 py-8 text-center text-xs text-slate-500">No notifications</li>}
              {notifications.map((n) => {
                const { Icon, cls } = TYPE[n.type] || TYPE.info;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => setNotifications((l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                      className={cx('flex w-full gap-2.5 border-b border-line/60 px-3 py-2.5 text-left hover:bg-white/[0.03]', !n.read && 'bg-cyan-400/[0.03]')}
                      title="Mark as read"
                    >
                      <span className={cx('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded', cls)}>
                        <Icon size={13} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className={cx('truncate text-[12.5px]', n.read ? 'text-slate-300' : 'font-semibold text-white')}>{n.title}</span>
                          <span className="num shrink-0 text-[10.5px] text-slate-500">{n.time}</span>
                        </span>
                        {n.detail && <span className="mt-0.5 block truncate text-[11px] text-slate-500">{n.detail}</span>}
                      </span>
                      {!n.read && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

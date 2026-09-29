import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, Zap } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: { Icon: CheckCircle2, cls: 'text-emerald-300', bar: 'bg-emerald-400' },
  warning: { Icon: AlertTriangle, cls: 'text-amber-300', bar: 'bg-amber-400' },
  critical: { Icon: Zap, cls: 'text-red-300', bar: 'bg-red-500' },
  info: { Icon: Info, cls: 'text-cyan-300', bar: 'bg-cyan-400' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message, type = 'success', detail) => {
      const id = ++idRef.current;
      setToasts((t) => [...t.slice(-3), { id, message, type, detail }]);
      setTimeout(() => dismiss(id), 3600);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-20 right-4 z-[3000] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2 md:bottom-6">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const { Icon, cls, bar } = ICONS[t.type] || ICONS.info;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
                className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-md border border-white/10 bg-ink-800/95 px-3.5 py-3 shadow-2xl backdrop-blur"
                role="status"
              >
                <span className={`absolute inset-y-0 left-0 w-0.5 ${bar}`} />
                <Icon size={17} className={`mt-0.5 shrink-0 ${cls}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-slate-100">{t.message}</p>
                  {t.detail && <p className="mt-0.5 text-xs text-slate-400">{t.detail}</p>}
                </div>
                <button onClick={() => dismiss(t.id)} className="text-slate-500 hover:text-slate-200" aria-label="Dismiss notification">
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

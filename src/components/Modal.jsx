import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cx } from '../utils/formatters.js';

export default function Modal({ open, onClose, title, kicker, children, width = 'max-w-3xl', headerExtra }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[2500] flex items-end justify-center p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className={cx('relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-xl border border-white/10 bg-ink-900 shadow-2xl sm:rounded-xl', width)}
          >
            <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-3.5">
              <div className="min-w-0">
                {kicker && <div className="mb-1">{kicker}</div>}
                <h2 className="text-[16px] font-semibold text-white">{title}</h2>
              </div>
              <div className="flex items-center gap-2">
                {headerExtra}
                <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close dialog">
                  <X size={18} />
                </button>
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

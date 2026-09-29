import { useEffect, useRef, useState } from 'react';

/** Smoothly animates a numeric value toward `target` (ease-in-out, ~30fps updates). */
export function useTween(target, duration = 900) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const from = valueRef.current;
    if (Math.abs(from - target) < 1e-4) return undefined;
    fromRef.current = from;
    const start = performance.now();
    let raf;
    let last = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      if (now - last > 32 || p === 1) {
        last = now;
        const v = from + (target - from) * e;
        valueRef.current = v;
        setValue(v);
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

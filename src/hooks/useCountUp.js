import { useEffect, useRef, useState } from "react";

// Counts from 0 to `target` when the node enters view. Has a fallback timer so
// above-the-fold figures still animate even when a preloader briefly locks
// scroll and the IntersectionObserver's initial entry is missed.
export function useCountUp(target, { duration = 1400, decimals = 0, delay = 0 } = {}) {
  const ref = useRef(null);
  const [val, setVal] = useState(target);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(target); return; }
    setVal(0);

    const run = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now() + delay;
      const tick = (now) => {
        const p = Math.max(0, Math.min(1, (now - t0) / duration));
        setVal(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(target);
      };
      requestAnimationFrame(tick);
    };

    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < innerHeight * 0.95 && r.bottom > 0;
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } }),
      { threshold: 0.35 }
    );
    io.observe(el);
    // fallback: after any preloader has released, animate if we're on screen
    const fb = setTimeout(() => { if (!started.current && inView()) { run(); io.disconnect(); } }, 2500);

    return () => { io.disconnect(); clearTimeout(fb); };
  }, [target, duration, delay]);

  const display =
    decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-IN");
  return [ref, display];
}

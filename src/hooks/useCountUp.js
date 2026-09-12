import { useEffect, useRef, useState } from "react";

// Counts from 0 to `target` when the node enters view. Has a fallback timer so
// above-the-fold figures still animate even when a preloader briefly locks
// scroll and the IntersectionObserver's initial entry is missed.
export function useCountUp(target, { duration = 1400, decimals = 0, delay = 0 } = {}) {
  const ref = useRef(null);
  const format = (value) => decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN");
  const [display, setDisplay] = useState(() => format(target));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const formatValue = (value) => decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setDisplay(formatValue(target)); return; }
    let started = false;
    let raf = 0;
    let previous = formatValue(0);
    setDisplay(previous);

    const run = () => {
      if (started) return;
      started = true;
      const t0 = performance.now() + delay;
      const tick = (now) => {
        const p = Math.max(0, Math.min(1, (now - t0) / duration));
        const next = formatValue(target * (1 - Math.pow(1 - p, 3)));
        if (next !== previous) { setDisplay(next); previous = next; }
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
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
    const fb = setTimeout(() => { if (!started && inView()) { run(); io.disconnect(); } }, 2500);

    return () => { io.disconnect(); clearTimeout(fb); cancelAnimationFrame(raf); };
  }, [target, duration, delay, decimals]);

  return [ref, display];
}
